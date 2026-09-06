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

const DEFAULT_WHATSAPP = "972569992888";
const DEFAULT_FACEBOOK = "https://www.facebook.com/Argelalpasha?locale=ar_AR";
const DEFAULT_INSTAGRAM = "https://www.instagram.com/argyl_and_maazel_al_basha/";

export function getShopContact(): ShopContact {
  const values = contactSchema.parse({
    SHOP_WHATSAPP_NUMBER: process.env.SHOP_WHATSAPP_NUMBER || DEFAULT_WHATSAPP,
    SHOP_FACEBOOK_URL: process.env.SHOP_FACEBOOK_URL || DEFAULT_FACEBOOK,
    SHOP_INSTAGRAM_URL: process.env.SHOP_INSTAGRAM_URL || DEFAULT_INSTAGRAM,
  });

  return {
    whatsappNumber: values.SHOP_WHATSAPP_NUMBER?.replace(/\D/g, "") || DEFAULT_WHATSAPP,
    facebookUrl: values.SHOP_FACEBOOK_URL || DEFAULT_FACEBOOK,
    instagramUrl: values.SHOP_INSTAGRAM_URL || DEFAULT_INSTAGRAM,
  };
}
