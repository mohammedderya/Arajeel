import { prisma } from "@/lib/prisma";

function baseSlug(name: string) {
  const normalized = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "category";
}

export async function uniqueCategorySlug(name: string, excludedId?: number) {
  const base = baseSlug(name);
  let slug = base;
  let suffix = 2;
  while (await prisma.category.findFirst({ where: { slug, ...(excludedId ? { id: { not: excludedId } } : {}) } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}
