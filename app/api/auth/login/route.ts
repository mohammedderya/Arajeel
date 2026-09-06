import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth";
import { checkLoginRateLimit } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

const genericError = { error: "Invalid email or password" };

function getClientIp(request: NextRequest) {
  const value = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const parsed = z.string().max(100).safeParse(value);
  return parsed.success ? parsed.data : "invalid-ip";
}

export async function POST(request: NextRequest) {
  const limit = checkLoginRateLimit(getClientIp(request));
  if (!limit.allowed) {
    return NextResponse.json(genericError, {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter) },
    });
  }

  try {
    const input = credentialsSchema.parse(await request.json());
    const admin = await prisma.admin.findUnique({ where: { email: input.email.toLowerCase() } });
    const passwordMatches = admin ? await bcrypt.compare(input.password, admin.passwordHash) : false;

    if (!admin || !passwordMatches) return NextResponse.json(genericError, { status: 401 });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: await createAuthToken(admin.id),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json(genericError, { status: 401 });
  }
}
