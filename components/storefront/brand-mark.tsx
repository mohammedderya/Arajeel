import Link from "next/link";

export function BrandMark({ size = "lg" }: { size?: "sm" | "lg" }) {
  if (size === "sm") {
    return (
      <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold/50 bg-gold/10">
          <span className="text-gold text-sm font-display font-bold">P</span>
        </div>
        <div className="leading-tight">
          <span className="block text-sm font-bold text-cream">أراجيل الباشا</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/60 bg-gold/10">
        <span className="text-gold text-2xl font-display font-extrabold">P</span>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-gold text-sm">♛</div>
      </div>
      <div className="leading-tight">
        <span className="block text-xl font-display font-extrabold text-cream">أراجيل ومعسل الباشا</span>
        <span className="block text-[11px] text-gold/70">طعم الأصالة .. جلسة تليق بك</span>
      </div>
    </Link>
  );
}
