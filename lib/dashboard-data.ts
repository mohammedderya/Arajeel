import "server-only";

import { prisma } from "@/lib/prisma";

export async function getDashboardProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
  });
}

export async function getDashboardCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getDashboardProduct(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}
