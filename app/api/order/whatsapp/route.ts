import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getShopContact } from "@/lib/shop-contact";
import { getProductUrl } from "@/lib/storefront";
import { prisma } from "@/lib/prisma";
import { orderProductIdSchema } from "@/lib/dashboard-schemas";

const formSchema = z.object({ productId: orderProductIdSchema });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { productId } = formSchema.parse({ productId: formData.get("productId") });
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { name: true, price: true, inStock: true } });
    const contact = getShopContact();
    if (!product || !product.inStock || !contact.whatsappNumber) return NextResponse.json({ error: "Unable to create order link" }, { status: 400 });
    const message = `مرحباً، أود طلب:\nالمنتج: ${product.name}\nالسعر: ${product.price.toString()} ₪\nرابط المنتج: ${getProductUrl(productId)}`;
    return NextResponse.redirect(`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`, 303);
  } catch { return NextResponse.json({ error: "Unable to create order link" }, { status: 400 }); }
}
