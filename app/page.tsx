import { SiteHeader } from "@/components/storefront/site-header";
import { Hero } from "@/components/storefront/hero";
import { CategoryCard } from "@/components/storefront/category-card";
import { Footer } from "@/components/storefront/footer";
import { getCategories, type CategorySummary } from "@/lib/storefront";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <SiteHeader />

      <Hero />

      {/* Categories */}
      <section id="categories" className="w-full bg-bg">
        <div className="mx-auto max-w-[1200px] w-[calc(100%-40px)] py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category: CategorySummary) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Al Basha? */}
      <section id="contact" className="w-full bg-bg border-t border-border/30">
        <div className="mx-auto max-w-[1200px] w-[calc(100%-40px)] py-10 md:py-14">
          <div className="text-center mb-8">
            <div className="gold-divider mx-auto mb-4" />
            <h2 className="section-title text-cream">لماذا الباشا؟</h2>
            <p className="text-muted text-sm mt-2">الجودة والثقة في خدمة تجربتك</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: "✓", title: "منتجات مختارة بعناية", desc: "كل منتج يمر بمراحل فحص صارمة" },
              { icon: "★", title: "جودة موثوقة", desc: "نضمن لك جودة كل منتج" },
              { icon: "📦", title: "تغليف آمن", desc: "تغليف احترافي يحافظ على المنتج" },
              { icon: "💬", title: "تواصل سريع", desc: "فريق دعم متاح على مدار الساعة" },
              { icon: "🚚", title: "شحن سريع", desc: "توصيل لجميع المدن الفلسطينية" },
              { icon: "💬", title: "دعم عبر واتساب", desc: "تواصل مباشر وفوري" },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl bg-bg-card border border-border/50 p-5 md:p-6 text-center hover:border-gold/30 transition"
              >
                <div className="text-gold text-2xl md:text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-display font-bold text-cream text-sm mb-1">{feature.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
