
import jwt, { type JwtPayload } from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }

  return secret;
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId },
    getJwtSecret(),
    { expiresIn: "15m" }
  );
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, getJwtSecret());
}
