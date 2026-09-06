import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

const adminEnvSchema = z.object({
  ADMIN_EMAIL: z.string().email().transform((email) => email.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(12),
});

const categories = [
  { name: "الأراجيل", slug: "hookahs" },
  { name: "المعسل", slug: "molasses" },
  { name: "الدخان", slug: "tobacco" },
  { name: "الإكسسوارات", slug: "accessories" },
] as const;

const products = [
  {
    name: "أرجيلة الباشا الملكية",
    description: "أرجيلة فاخرة بتصميم ملكي أنيق، صُنعت من أجود الخامات لتجربة تدخين استثنائية. تصميم كلاسيكي يجمع بين الأصالة والحداثة.",
    price: 850,
    categorySlug: "hookahs",
    inStock: true,
    images: [
      { url: "/images/products/hookah-1.webp", isPrimary: true, sortOrder: 0 },
      { url: "/images/products/hookah-2.webp", isPrimary: false, sortOrder: 1 },
    ],
  },
  {
    name: "أرجيلة ستانلس ذهبية",
    description: "أرجيلة من الستانلس ستيل المقاوم للصدأ بلمسة ذهبية أنيقة. سهلة التنظيف والصيانة، مناسبة للاستخدام اليومي.",
    price: 650,
    categorySlug: "hookahs",
    inStock: true,
    images: [
      { url: "/images/products/hookah-2.webp", isPrimary: true, sortOrder: 0 },
    ],
  },
  {
    name: "معسل الباشا — تفاحتين",
    description: "معسل فاخر بنكهة التفاحتين المميزة. مزيج من التفاح الأخضر والأحمر مع لمسة من النعناع الطازج.",
    price: 45,
    categorySlug: "molasses",
    inStock: true,
    images: [
      { url: "/images/products/molasses-1.webp", isPrimary: true, sortOrder: 0 },
      { url: "/images/products/molasses-2.webp", isPrimary: false, sortOrder: 1 },
    ],
  },
  {
    name: "معسل الباشا — نعناع",
    description: "نكهة النعناع الطازج المنعشة. مناسبة لل特权 في الأيام الحارة مع نكهة قوية ودائمة.",
    price: 45,
    categorySlug: "molasses",
    inStock: true,
    images: [
      { url: "/images/products/molasses-2.webp", isPrimary: true, sortOrder: 0 },
    ],
  },
  {
    name: "طقم إكسسوارات الجلسة",
    description: "طقم كامل يشمل ملقط الفحم،נקية الأرجيلة، وحامل الفحم. من الستانلس ستيل الفاخر.",
    price: 120,
    categorySlug: "accessories",
    inStock: true,
    images: [
      { url: "/images/products/accessories-1.webp", isPrimary: true, sortOrder: 0 },
    ],
  },
  {
    name: "فحم أرجيلة سريع الاشتعال",
    description: "فحم طبيعي سريع الاشتعال يدوم طويلاً. مناسب لجميع أنواع الأراجيل. يوفر حرارة مستقرة ولفائف نظيفة.",
    price: 35,
    categorySlug: "accessories",
    inStock: true,
    images: [
      { url: "/images/products/accessories-1.webp", isPrimary: true, sortOrder: 0 },
    ],
  },
];

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

async function seedProducts() {
  for (const product of products) {
    const category = await prisma.category.findUnique({ where: { slug: product.categorySlug } });
    if (!category) continue;

    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { price: product.price, inStock: product.inStock, description: product.description },
      });
      continue;
    }

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: category.id,
        inStock: product.inStock,
        images: {
          create: product.images.map((img) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
      },
    });
  }
}

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = adminEnvSchema.parse(process.env);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const existingAdmin = await prisma.admin.findFirst({ orderBy: { id: "asc" } });

  if (existingAdmin) {
    await prisma.admin.update({ where: { id: existingAdmin.id }, data: { email: ADMIN_EMAIL, passwordHash } });
    return;
  }

  await prisma.admin.create({ data: { email: ADMIN_EMAIL, passwordHash } });
}

async function main() {
  await seedCategories();
  await seedProducts();
  await seedAdmin();
  console.log("Seed completed successfully!");
}

main()
  .catch(() => {
    console.error("Database seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
