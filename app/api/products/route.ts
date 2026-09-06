import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { productSchema } from "@/lib/dashboard-schemas";

const errorResponse = () => NextResponse.json({ error: "Unable to save product" }, { status: 400 });

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = productSchema.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
    if (!category) return errorResponse();
    await prisma.product.create({ data: { name: data.name, description: data.description, price: data.price, categoryId: data.categoryId, inStock: data.inStock, images: { create: data.images } } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return errorResponse(); }
}
