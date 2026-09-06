"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "لوحة التحكم", icon: "📊" },
  { href: "/dashboard/products", label: "المنتجات", icon: "📦" },
  { href: "/dashboard/categories", label: "التصنيفات", icon: "🏷" },
];

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold text-sm shrink-0">♛</div>
          <div className="leading-tight overflow-hidden">
            <span className="block text-xs font-bold text-cream truncate">أراجيل الباشا</span>
            <span className="block text-[9px] text-gold/60">لوحة التحكم</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition mb-0.5 ${
                isActive
                  ? "bg-gold/10 text-gold font-bold border-r-2 border-gold"
                  : "text-muted hover:text-cream hover:bg-bg-card"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-cream hover:bg-bg-card transition mb-1">
          <span className="text-base">🏠</span>
          المتجر
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-500/10 transition">
          <span className="text-base">🚪</span>
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 right-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-card border border-border text-cream"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMobileOpen(false)}>
          <aside className="fixed right-0 top-0 h-full w-[260px] bg-bg-light border-l border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 left-3 text-muted hover:text-cream">✕</button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed right-0 top-0 h-full w-[220px] bg-bg-light border-l border-border flex-col z-40">
        {sidebarContent}
      </aside>
    </>
  );
}
