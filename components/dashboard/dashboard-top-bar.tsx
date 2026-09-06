"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "نظرة عامة",
  "/dashboard/products": "المنتجات",
  "/dashboard/products/new": "إضافة منتج",
  "/dashboard/categories": "التصنيفات",
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "لوحة التحكم";

  return (
    <div className="sticky top-0 z-30 bg-[#141414] border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
      <h1 className="font-display text-lg font-bold text-cream">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted hidden sm:inline">admin@arajeel.com</span>
        <div className="h-8 w-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold">م</div>
      </div>
    </div>
  );
}
