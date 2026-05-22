/**
 * Capacitor auth bridge.
 *
 * Handles the mobile-specific parts of authentication:
 *   – Launching the OAuth flow in the system browser
 *   – Listening for the deep-link callback
 *   – Storing / retrieving / clearing the JWT from secure preferences
 *
 * This module is only imported in client components that run inside
 * the Capacitor WebView. It degrades gracefully to no-ops when
 * Capacitor plugins are unavailable (e.g. during `next dev` in a browser).
 */

import { Capacitor } from "@capacitor/core";

// ---------- token storage ----------

const TOKEN_KEY = "auth_token";

export async function getToken(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) {
    return localStorage.getItem(TOKEN_KEY);
  }
  const { Preferences } = await import("@capacitor/preferences");
  const { value } = await Preferences.get({ key: TOKEN_KEY });
  return value;
}

export async function setToken(token: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  const { Preferences } = await import("@capacitor/preferences");
  await Preferences.set({ key: TOKEN_KEY, value: token });
}

export async function clearToken(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  const { Preferences } = await import("@capacitor/preferences");
  await Preferences.remove({ key: TOKEN_KEY });
}

// ---------- OAuth launch ----------

/**
 * Opens the Google OAuth sign-in page in the system browser.
 * After authentication, the server redirects to `/api/auth/mobile-callback`
 * which deep-links back to `payguardian://auth-callback?token=<jwt>`.
 */
export async function launchSignIn(apiBaseUrl: string): Promise<void> {
  const callbackUrl = `${apiBaseUrl}/api/auth/mobile-callback`;
  const signInUrl = `${apiBaseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  if (!Capacitor.isNativePlatform()) {
    // In browser dev mode, just redirect
    window.location.href = signInUrl;
    return;
  }

  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url: signInUrl });
}

// ---------- Deep-link listener ----------

/**
 * Registers a one-time listener for the `payguardian://auth-callback` deep link.
 * Returns a Promise that resolves with the JWT when the callback fires.
 */
export function listenForAuthCallback(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!Capacitor.isNativePlatform()) {
      reject(new Error("Deep-link listener is only available on native platforms"));
      return;
    }

    const { App } = await import("@capacitor/app");
    const { Browser } = await import("@capacitor/browser");

    const handle = await App.addListener("appUrlOpen", async (event) => {
      try {
        const url = new URL(event.url);

        if (url.protocol === "payguardian:" && url.host === "auth-callback") {
          const token = url.searchParams.get("token");
          if (token) {
            await setToken(token);
            await Browser.close();
            handle.remove();
            resolve(token);
          } else {
            handle.remove();
            reject(new Error("Auth callback received without token"));
          }
        }
      } catch (err) {
        handle.remove();
        reject(err);
      }
    });
  });
}
