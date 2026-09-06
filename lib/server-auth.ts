import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const adminId = await verifyAuthToken(token);
    return adminId ? await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true } }) : null;
  } catch {
    return null;
  }
}
