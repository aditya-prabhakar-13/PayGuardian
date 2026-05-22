import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/auth";

/**
 * Mobile callback endpoint.
 *
 * After standard NextAuth Google sign-in completes on the server, the mobile
 * client is redirected here. We read the authenticated session, mint a
 * long-lived JWT, and redirect to the Capacitor deep-link scheme so the
 * native app can capture it.
 *
 * Flow:
 *   1. Capacitor opens system browser → /api/auth/signin/google
 *   2. Google OAuth completes → NextAuth session cookie set
 *   3. Redirect → /api/auth/mobile-callback (this route)
 *   4. This route signs a JWT and redirects → payguardian://auth-callback?token=<jwt>
 *   5. Capacitor `appUrlOpen` listener extracts the token
 */
export async function GET(_req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "Server misconfiguration: JWT_SECRET is not set." },
      { status: 500 }
    );
  }

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated. Please sign in first." },
      { status: 401 }
    );
  }

  const payload = {
    userId: (session as unknown as { userId?: string }).userId,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
    issuer: "payguardian",
  });

  // Redirect to the Capacitor deep-link scheme
  const redirectUrl = `payguardian://auth-callback?token=${encodeURIComponent(token)}`;

  // Use a meta-refresh fallback for browsers that don't handle custom schemes
  // via 302 redirects.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
      </head>
      <body>
        <p>Redirecting to Pay Guardian...</p>
        <script>window.location.href = "${redirectUrl}";</script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
