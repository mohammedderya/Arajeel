import "server-only";

import { prisma } from "@/lib/prisma";

export type ProductSummary = {
  id: number;
  name: string;
  price: string;
  inStock: boolean;
  thumbnailUrl: string | null;
  productUrl: string;
};

export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
};

export function safeImageUrl(value: string | null | undefined) {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<CategorySummary[]> {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    imageUrl: safeImageUrl(category.imageUrl),
    productCount: category._count.products,
  }));
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  return products.map(toProductSummary);
}

export async function getCategoryPage(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      },
    },
  });
  if (!category) return null;

  return {
    name: category.name,
    slug: category.slug,
    products: category.products.map(toProductSummary),
  };
}

export async function getProductPage(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    inStock: product.inStock,
    category: product.category,
    productUrl: getProductUrl(product.id),
    images: product.images.map((image) => ({
      id: image.id,
      url: safeImageUrl(image.url),
      isPrimary: image.isPrimary,
    })),
  };
}

function toProductSummary(product: {
  id: number;
  name: string;
  price: unknown;
  inStock: boolean;
  images: { url: string }[];
}): ProductSummary {
  return {
    id: product.id,
    name: product.name,
    price: String(product.price),
    inStock: product.inStock,
    thumbnailUrl: safeImageUrl(product.images[0]?.url),
    productUrl: getProductUrl(product.id),
  };
}

export function getProductUrl(id: number) {
  const path = `/products/${id}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return siteUrl ? new URL(path, siteUrl).toString() : path;
}
