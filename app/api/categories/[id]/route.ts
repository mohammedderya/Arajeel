import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { categorySchema, entityIdSchema } from "@/lib/dashboard-schemas";
import { uniqueCategorySlug } from "@/lib/slug";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = entityIdSchema.parse(params.id);
    const data = categorySchema.parse(await request.json());
    await prisma.category.update({ where: { id }, data: { name: data.name, slug: await uniqueCategorySlug(data.name, id), ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Unable to update category" }, { status: 400 }); }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = entityIdSchema.parse(params.id);
    const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
    if (!category) return NextResponse.json({ error: "Unable to delete category" }, { status: 404 });
    if (category._count.products > 0) return NextResponse.json({ error: "This category still has products. Reassign them before deleting it." }, { status: 409 });
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Unable to delete category" }, { status: 400 }); }
}
