import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/storefront/site-header";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductCard } from "@/components/storefront/product-card";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Footer } from "@/components/storefront/footer";
import { getProductPage, getFeaturedProducts } from "@/lib/storefront";
import { entityIdSchema } from "@/lib/dashboard-schemas";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const parsedId = entityIdSchema.safeParse(params.id);
  if (!parsedId.success) notFound();
  const product = await getProductPage(parsedId.data);
  if (!product) notFound();
  const formattedPrice = Number(product.price).toFixed(0);
  const related = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-gold transition">{product.category.name}</Link>
          <span>/</span>
          <span className="text-cream">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold text-2xl">♛</span>
              {product.inStock && (
                <span className="flex items-center gap-1 rounded-lg bg-whatsapp/10 px-2.5 py-1 text-[11px] font-bold text-whatsapp">
                  ✓ متوفر
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold text-cream mb-2">{product.name}</h1>
            <p className="text-muted text-sm mb-6">{product.category.name}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-gold text-3xl font-bold">{formattedPrice} ₪</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-bg-card border border-border/50 text-center py-3 px-2 hover:border-gold/20 transition">
                <span className="text-gold text-lg">🎁</span>
                <p className="text-[10px] text-muted mt-1">تغليف فاخر</p>
              </div>
              <div className="rounded-xl bg-bg-card border border-border/50 text-center py-3 px-2 hover:border-gold/20 transition">
                <span className="text-gold text-lg">🚚</span>
                <p className="text-[10px] text-muted mt-1">توصيل سريع</p>
              </div>
            </div>

            <p className="text-muted leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>

            <div className="space-y-3">
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={formattedPrice}
                image={product.images[0]?.url ?? null}
              />
              <button className="w-full rounded-xl border border-border py-3 font-bold text-muted transition hover:border-gold hover:text-gold flex items-center justify-center gap-2">
                <span>♡</span> أضف إلى المفضلة
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-10">
              <div className="gold-divider mx-auto mb-4" />
              <h2 className="section-title text-cream">منتجات مشابهة</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
