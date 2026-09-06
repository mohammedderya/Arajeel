import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/storefront/site-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Footer } from "@/components/storefront/footer";
import { getCategoryPage } from "@/lib/storefront";
import { categorySlugSchema } from "@/lib/dashboard-schemas";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const parsedSlug = categorySlugSchema.safeParse(params.slug);
  if (!parsedSlug.success) notFound();
  const category = await getCategoryPage(parsedSlug.data);
  if (!category) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-6 py-10">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
          <span>/</span>
          <span className="text-cream">{category.name}</span>
        </nav>

        <div className="text-center mb-12">
          <div className="gold-divider mx-auto mb-4" />
          <h1 className="section-title text-cream mb-2">{category.name}</h1>
          <p className="text-muted text-sm mt-2">اختر المنتج الذي يناسب ذوقك واجعل جلستك أجمل.</p>
        </div>

        {category.products.length > 0 ? (
          <ProductGrid products={category.products} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-bg-card py-20 text-center text-muted">
            لا توجد منتجات في هذا القسم حاليًا.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
