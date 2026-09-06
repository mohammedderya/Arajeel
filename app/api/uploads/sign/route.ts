import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";

export async function POST() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = crypto.randomUUID();
  return NextResponse.json({ uploadUrl: `/api/uploads/${id}`, publicUrl: `/uploads/${id}.jpg` });
}
