import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { entityIdSchema, productSchema } from "@/lib/dashboard-schemas";

const errorResponse = () => NextResponse.json({ error: "Unable to update product" }, { status: 400 });

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = entityIdSchema.parse(params.id);
    const data = productSchema.parse(await request.json());
    await prisma.$transaction(async (transaction) => {
      await transaction.product.update({ where: { id }, data: { name: data.name, description: data.description, price: data.price, categoryId: data.categoryId, inStock: data.inStock } });
      await transaction.productImage.deleteMany({ where: { productId: id } });
      if (data.images.length) await transaction.productImage.createMany({ data: data.images.map((image) => ({ ...image, productId: id })) });
    });
    return NextResponse.json({ success: true });
  } catch { return errorResponse(); }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = entityIdSchema.parse(params.id);
    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Unable to delete product" }, { status: 400 });
  }
}
