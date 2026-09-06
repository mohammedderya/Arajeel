"use client";

import Link from "next/link";
import type { ProductSummary } from "@/lib/storefront";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { DirectBuyButton } from "@/components/storefront/direct-buy-button";

function formatPrice(price: string) {
  return `${Number(price).toFixed(0)} ₪`;
}

const badges = ["جديد", "الأكثر طلبًا", "حصري", "الأفضل مبيعاً"];

export function ProductCard({ product, index = 0 }: { product: ProductSummary; index?: number }) {
  const badge = index < badges.length ? badges[index] : null;

  return (
    <article className="group rounded-2xl overflow-hidden border border-border bg-bg-card hover:border-gold/30 transition-all duration-300 flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-[180px] md:h-[200px] overflow-hidden bg-bg-hover">
          {product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-bg-light">
              <span className="text-5xl text-gold/20 font-display">ب</span>
            </div>
          )}
          {badge && (
            <span className="absolute top-3 right-3 rounded-lg bg-gold px-3 py-1 text-[11px] font-bold text-bg">
              {badge}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-3 left-3 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-bold text-white">
              نفد المخزون
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-bold text-cream text-sm leading-snug mb-2 line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>
          <span className="text-gold font-extrabold text-lg">{formatPrice(product.price)}</span>
        </div>
      </Link>
      <div className="px-3 pb-3 flex items-center gap-2">
        <DirectBuyButton
          id={product.id}
          name={product.name}
          price={formatPrice(product.price)}
          compact
          className="flex-1"
        />
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.thumbnailUrl ?? null}
          compact
        />
      </div>
    </article>
  );
}
