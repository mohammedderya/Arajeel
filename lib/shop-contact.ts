import { z } from "zod";

const contactSchema = z.object({
  SHOP_WHATSAPP_NUMBER: z.string().regex(/^\+?[0-9 ()-]{7,20}$/).optional(),
  SHOP_FACEBOOK_URL: z.string().url().optional(),
  SHOP_INSTAGRAM_URL: z.string().url().optional(),
});

export type ShopContact = {
  whatsappNumber: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
};

export function getShopContact(): ShopContact {
  const values = contactSchema.parse({
    SHOP_WHATSAPP_NUMBER: process.env.SHOP_WHATSAPP_NUMBER || undefined,
    SHOP_FACEBOOK_URL: process.env.SHOP_FACEBOOK_URL || undefined,
    SHOP_INSTAGRAM_URL: process.env.SHOP_INSTAGRAM_URL || undefined,
  });

  return {
    whatsappNumber: values.SHOP_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? null,
    facebookUrl: values.SHOP_FACEBOOK_URL ?? null,
    instagramUrl: values.SHOP_INSTAGRAM_URL ?? null,
  };
}
