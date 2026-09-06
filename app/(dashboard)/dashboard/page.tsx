import Link from "next/link";
import { getDashboardProducts, getDashboardCategories } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const [products, categories] = await Promise.all([getDashboardProducts(), getDashboardCategories()]);
  const outOfStock = products.filter(p => !p.inStock).length;
  const thisWeek = products.filter(p => {
    const d = new Date(p.createdAt);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    { label: "إجمالي المنتجات", value: products.length, icon: "📦" },
    { label: "التصنيفات", value: categories.length, icon: "🏷" },
    { label: "نفد المخزون", value: outOfStock, icon: "⚠" },
    { label: "أضيف هذا الأسبوع", value: thisWeek, icon: "🆕" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted text-xs">{stat.label}</span>
              <span className="text-sm">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/products/new" className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-bg hover:bg-gold-light transition">
          + إضافة منتج
        </Link>
        <Link href="/dashboard/categories" className="rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-bold text-gold hover:bg-gold hover:text-bg transition">
          + إدارة التصنيفات
        </Link>
      </div>
    </div>
  );
}
