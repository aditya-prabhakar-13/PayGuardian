---
phase: 1
researched_at: 2026-05-22
discovery_level: 2
---

# Phase 1 Research

## Objective
Answer how to configure Next.js 14+ dynamically for static export (Capacitor) and server mode (Vercel API), set up Capacitor 6 in the same directory, and implement a robust mobile Google OAuth sign-in flow that securely returns a JWT session token to the Capacitor client.

## Discovery Level
**Level 2** — Standard research

## Key Decisions

### Decision 1: Monorepo vs Split Repositories
**Question:** Should the backend Vercel hosting of Next.js and the client-side Capacitor application be in separate repositories or a single Next.js project?
**Options Considered:**
1. **Split Repositories:** Mobile app (pure React/Vite/Capacitor) in repo A; Next.js backend API in repo B.
   * *Pros:* Clear separation of concerns; no build configuration conflicts.
   * *Cons:* Dual repositories to maintain, duplication of TypeScript types and models, more deployment/link overhead.
2. **Single Monorepo Next.js:** Single project.
   * *Pros:* Shared schemas/types, unified developer workspace, easy schema changes.
   * *Cons:* Requires conditional `next.config.js` output configurations (static client assets vs Vercel Serverless API routes).
**Decision:** Option 2 (Single project monorepo). We will use a conditional environment variable `OUTPUT_MODE=export` to build static client assets for Capacitor, and default server builds for Vercel.
**Confidence:** High

### Decision 2: Mobile JWT OAuth Callback Handshake
**Question:** How does the user authenticate via Google OAuth in Capacitor without cookie sharing issues?
**Options Considered:**
1. **Cookie-based sessions:** Run the Capacitor app pointing to Vercel dynamically.
   * *Pros:* Standard next-auth flow works out-of-the-box.
   * *Cons:* App doesn't work offline; web assets are not bundled (violates app store guidelines and offline requirement).
2. **JWT Deep-Link callback:** Launch login page in `@capacitor/browser`.
   * *Pros:* Works natively, browser session is standard, session token is returned via custom URL scheme (`payguardian://auth-callback?token=...`) and stored locally in `@capacitor/preferences`.
   * *Cons:* Requires custom deep link listener and an exchange/redirect route on Next.js.
**Decision:** Option 2.
**Confidence:** High

## Findings

### 1. Next.js Static Export Configuration
In `next.config.js`, we can conditionally export:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.OUTPUT_MODE === 'export' ? 'export' : undefined,
  // Ensure that client-side images do not use next/image server optimization during export
  images: {
    unoptimized: process.env.OUTPUT_MODE === 'export' ? true : undefined,
  },
};
```
When building for Capacitor:
```bash
cross-env OUTPUT_MODE=export next build
```
This builds static files into the `/out` directory, which Capacitor's `webDir` will point to.

### 2. Capacitor Android Setup
`capacitor.config.ts` must point to `/out` (where Next.js static files are exported):
```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.payguardian.app',
  appName: 'Pay Guardian',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```
For deep-linking, we must add an intent-filter inside `android/app/src/main/AndroidManifest.xml` under the `<activity>` tag:
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="payguardian" android:host="auth-callback" />
</intent-filter>
```

### 3. JWT Flow Mechanism
1. Mobile app detects no JWT in `@capacitor/preferences`.
2. Mobile app calls `Browser.open({ url: 'https://payguardian.vercel.app/api/auth/signin/google?callbackUrl=https://payguardian.vercel.app/api/auth/mobile-callback' })`.
3. NextAuth handles authentication on Vercel. Google OAuth authenticates user and redirects back to NextAuth.
4. NextAuth saves session. NextAuth calls our `pages/api/auth/mobile-callback` route (or App Router `app/api/auth/mobile-callback/route.ts`).
5. In `mobile-callback` route:
   * Read the NextAuth session/JWT.
   * Extract user ID, email, name, and profile image.
   * Sign a custom JWT containing `user_id` using a server-side secret (`JWT_SECRET`).
   * Redirect browser to: `payguardian://auth-callback?token=<signed_jwt>`.
6. Capacitor App captures the deep link:
   ```ts
   import { App } from '@capacitor/app';
   import { Browser } from '@capacitor/browser';
   import { Preferences } from '@capacitor/preferences';

   App.addListener('appUrlOpen', async (data) => {
     const url = new URL(data.url);
     if (url.scheme === 'payguardian' && url.host === 'auth-callback') {
       const token = url.searchParams.get('token');
       if (token) {
         await Preferences.set({ key: 'auth_token', value: token });
         await Browser.close();
         // Redirect app router to /dashboard
       }
     }
   });
   ```

## Dependencies Identified
| Package | Version | Purpose |
|---------|---------|---------|
| `@capacitor/core` | `^6.0.0` | Capacitor core library |
| `@capacitor/cli` | `^6.0.0` | Capacitor Command Line Interface |
| `@capacitor/android` | `^6.0.0` | Android platform support |
| `@capacitor/browser` | `^6.0.0` | Opens system browser for OAuth |
| `@capacitor/preferences` | `^6.0.0` | Native key-value store (encrypted at rest on Android) |
| `@capacitor/app` | `^6.0.0` | Handles app lifecycle and deep links |
| `next-auth` | `^5.0.0-beta.15` | Auth.js v5 for Next.js 14 App Router |
| `jsonwebtoken` | `^9.0.2` | Signing mobile JWT payload on callback |
| `mongoose` | `^8.0.0` | MongoDB object modeling |
| `mongodb` | `^6.0.0` | Direct database connection driver |
| `cross-env` | `^7.0.3` | Setting environment variables cross-platform (Windows compatible) |

## Risks
- **OAuth Callback Security:** Anyone can theoretically trigger the custom scheme deep link if they sniff a JWT.
  * *Mitigation:* The JWT is signed with a high-entropy secret (`JWT_SECRET`) on Vercel, holds a short expiration time (e.g., 30 days), and uses TLS (HTTPS) during the callback flow.
- **Next.js App Router Client Export Errors:** If we use any Server Components or dynamic routes in exportable client pages, next build will fail.
  * *Mitigation:* Enforce `'use client'` on all pages under `/src/app/(client)` and separate server-only routes into `/src/app/api`. Ensure dynamic routing (e.g., `[id]`) in static client files uses client-side hashes or query params rather than server-side path segments if possible, or use standard react-router/hash routing.

## Recommendations for Planning
1. Set up a standard Next.js 14 App Router skeleton first.
2. Initialize Capacitor immediately inside the project root and verify the static export build pipeline.
3. Configure NextAuth.js v5 Google OAuth provider and the `/api/auth/mobile-callback` route.
4. Verify OAuth flow on a local Android emulator using the Custom Deep Link.
