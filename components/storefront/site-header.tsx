"use client";

import Link from "next/link";
import { BrandMark } from "@/components/storefront/brand-mark";
import { useCart } from "@/lib/cart-context";

export function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="w-full bg-[#101311]">
      <div className="mx-auto flex max-w-[1200px] w-[calc(100%-40px)] items-center justify-between gap-6 py-4">
        {/* Logo - right side */}
        <BrandMark />

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-bold text-gold transition">الرئيسية</Link>
          <Link href="/category/hookahs" className="px-4 py-2 text-sm font-medium text-cream/80 hover:text-gold transition">الأراجيل</Link>
          <Link href="/category/molasses" className="px-4 py-2 text-sm font-medium text-cream/80 hover:text-gold transition">المعسل</Link>
          <Link href="/category/tobacco" className="px-4 py-2 text-sm font-medium text-cream/80 hover:text-gold transition">الدخان</Link>
          <Link href="/category/accessories" className="px-4 py-2 text-sm font-medium text-cream/80 hover:text-gold transition">الإكسسوارات</Link>
        </nav>

        {/* Search + Actions - left side */}
        <div className="flex items-center gap-4">
          <form className="hidden md:flex h-10 w-[220px] overflow-hidden rounded-xl border border-border/60 bg-bg-light/50">
            <input
              placeholder="ابحث عن منتج..."
              className="flex-1 border-0 bg-transparent px-4 text-sm text-cream outline-0 placeholder:text-muted/60"
            />
            <button type="submit" className="w-10 flex items-center justify-center text-muted hover:text-gold transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </form>

          <Link href="/cart" className="relative flex items-center gap-1 text-cream/80 hover:text-gold transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-bg">
                {totalItems}
              </span>
            )}
          </Link>

          <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/60 text-sm text-cream/80 hover:border-gold/40 hover:text-gold transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            حسابي
          </Link>

          <Link href="/#contact" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/60 text-sm text-cream/80 hover:border-gold/40 hover:text-gold transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            تواصل معنا
          </Link>
        </div>
      </div>
    </header>
  );
}
