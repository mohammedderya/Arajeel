"use client";

import { useState } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import type { ProductSummary } from "@/lib/storefront";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  const [sort, setSort] = useState("default");
  const [filter, setFilter] = useState("all");

  const filtered = products.filter((p) => {
    if (filter === "instock") return p.inStock;
    if (filter === "oos") return !p.inStock;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    return 0;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <span className="text-muted text-sm">{sorted.length} منتج</span>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-border bg-bg-card px-3 py-2 text-xs text-cream outline-0">
            <option value="all">الكل</option>
            <option value="instock">متوفر</option>
            <option value="oos">نفد المخزون</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-border bg-bg-card px-3 py-2 text-xs text-cream outline-0">
            <option value="default">الافتراضي</option>
            <option value="price-asc">السعر ↑</option>
            <option value="price-desc">السعر ↓</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
