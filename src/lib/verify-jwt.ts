import jwt from "jsonwebtoken";

/**
 * Utility to verify JWT Bearer tokens from API requests.
 * Used primarily for Next.js App Router API routes accessed by the Capacitor client.
 */
export async function verifyApiRequest(
  req: Request
): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return null;
  }

  try {
    // We cast to any because standard jwt.verify signature returns string | JwtPayload
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded && decoded.userId) {
      return { userId: decoded.userId };
    }
  } catch (error) {
    console.error("Failed to verify API JWT:", error);
  }

  return null;
}
