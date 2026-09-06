import Link from "next/link";
import { SiteHeader } from "@/components/storefront/site-header";
import { Footer } from "@/components/storefront/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <main className="mx-auto flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-gold text-6xl mb-4 font-display">♛</div>
        <h1 className="font-display text-3xl font-bold text-cream mb-2">404</h1>
        <p className="text-muted mb-6">الصفحة غير موجودة أو تم نقلها</p>
        <Link href="/" className="btn-gold inline-flex items-center gap-2">
          <span>العودة للرئيسية</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
