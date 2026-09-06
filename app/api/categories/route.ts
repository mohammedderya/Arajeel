import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { categorySchema } from "@/lib/dashboard-schemas";
import { uniqueCategorySlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = categorySchema.parse(await request.json());
    const slug = await uniqueCategorySlug(data.name);
    await prisma.category.create({ data: { name: data.name, slug, imageUrl: data.imageUrl ?? null } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to save category" }, { status: 400 }); }
}
