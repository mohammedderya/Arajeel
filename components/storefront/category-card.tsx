"use client";

import Link from "next/link";
import type { CategorySummary } from "@/lib/storefront";

const categoryData: Record<string, { img: string; fallback: string; desc: string; icon: JSX.Element }> = {
  hookahs: {
    img: "/images/pasha/hookahs.png",
    fallback: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80",
    desc: "تشكيلة فاخرة من الأراجيل الشرقية والحديثة",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><circle cx="12" cy="12" r="3"/><path d="M12 15v7"/><path d="M8 22h8"/><path d="M5 8c0 0 1-2 3-2h8c2 0 3 2 3 2"/></svg>,
  },
  molasses: {
    img: "/images/pasha/molasses.png",
    fallback: "https://images.unsplash.com/photo-1609167830220-7164aa360951?w=600&h=400&fit=crop&q=80",
    desc: "أطلب أنواع المعسل بنكهات متنوعة وجودة عالية",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  },
  tobacco: {
    img: "/images/pasha/tobacco.png",
    fallback: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=400&fit=crop&q=80",
    desc: "دخان فاخر للتجربة الأصيلة وذوق رفيع",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  },
  accessories: {
    img: "/images/categories/accessories.png",
    fallback: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop&q=80",
    desc: "كل ما تحتاجه لتجربة مميزة من الإكسسوارات",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
};

categoryData.charcoal = {
  img: "/images/pasha/charcoal.png",
  fallback: "/images/pasha/charcoal.png",
  desc: "فحم سريع الاشتعال لجلسة متواصلة",
  icon: <span>◆</span>,
};

const fallbackData = { img: "", fallback: "", desc: "اكتشف التشكيلة", icon: <span>◆</span> };

export function CategoryCard({ category }: { category: CategorySummary }) {
  const data = categoryData[category.slug] ?? fallbackData;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex min-h-[150px] items-center gap-5 rounded-2xl overflow-hidden border border-border/50 bg-bg-card p-4 transition-all duration-300 hover:border-gold/50"
    >
      <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-xl">
        <img
          src={data.img}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = data.fallback;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-base font-bold text-cream">{category.name}</h3>
          <span className="text-gold/70">{data.icon}</span>
        </div>
        <p className="text-muted text-xs leading-relaxed line-clamp-2">{data.desc}</p>
      </div>
    </Link>
  );
}
