import { z } from "zod";

const imageSchema = z.object({
  url: z.string().min(1).refine((value) => value.startsWith("/") || ["http:", "https:"].includes(new URL(value).protocol)),
  isPrimary: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  price: z.number().finite().positive().max(99999999),
  categoryId: z.number().int().positive(),
  inStock: z.boolean(),
  images: z.array(imageSchema).max(12),
}).superRefine((value, context) => {
  if (value.images.length > 0 && value.images.filter((image) => image.isPrimary).length !== 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["images"], message: "Exactly one primary image is required" });
  }
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  imageUrl: z.string().url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol)).nullable().optional(),
});

export const entityIdSchema = z.coerce.number().int().positive();
export const categorySlugSchema = z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const orderProductIdSchema = entityIdSchema;
export const searchQuerySchema = z.string().max(160);
