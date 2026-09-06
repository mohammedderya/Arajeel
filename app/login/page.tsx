import Link from "next/link";
import { SiteHeader } from "@/components/storefront/site-header";
import { Footer } from "@/components/storefront/footer";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-[1200px] items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px] rounded-2xl bg-bg-card border border-border p-8">
          <div className="text-center mb-6">
            <div className="text-gold text-3xl mb-2 font-display">♛</div>
            <h1 className="font-display text-2xl font-bold text-cream mb-1">لوحة التحكم</h1>
            <p className="text-muted text-sm">سجّل الدخول للوصول إلى لوحة التحكم</p>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
