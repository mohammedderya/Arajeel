import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "arajeel_auth";
const TOKEN_DURATION = "8h";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createAuthToken(adminId: number) {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_DURATION)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });
  return typeof payload.adminId === "number" ? payload.adminId : null;
}
