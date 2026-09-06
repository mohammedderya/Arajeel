"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/category/hookahs", label: "الأراجيل" },
  { href: "/category/molasses", label: "المعسل" },
  { href: "/category/tobacco", label: "الدخان" },
  { href: "/category/accessories", label: "الإكسسوارات" },
  { href: "/#featured", label: "العروض" },
  { href: "/#contact", label: "تواصل معنا" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block w-full bg-[#171C1A]/60 border-t border-b border-border/30">
      <div className="mx-auto flex max-w-[1200px] w-[calc(100%-40px)] overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap px-5 py-3 text-sm font-medium transition"
              style={{
                color: isActive ? "#D5AB57" : "#A9AFA8",
              }}
            >
              {link.label}
              {isActive && (
                <span
                  className="absolute bottom-0 right-0 h-[2px] w-full rounded-full"
                  style={{ backgroundColor: "#D5AB57" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
