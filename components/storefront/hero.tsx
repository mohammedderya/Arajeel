"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="w-full bg-bg">
      <Link href="/#categories" className="mx-auto block max-w-[1200px] w-[calc(100%-40px)] relative rounded-2xl overflow-hidden min-h-[310px] md:min-h-[460px] mt-2 border border-border">
        <img
          src="/images/pasha/hero.png"
          alt="جلسة الباشا تبدأ من هنا"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </Link>
    </section>
  );
}
