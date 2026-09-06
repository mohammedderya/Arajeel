"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";

type Product = { id: number; name: string; price: string; inStock: boolean; createdAt: string; category: { name: string }; images: { url: string }[] };

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>(products);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const perPage = 10;

  useEffect(() => {
    setItems(products);
  }, [products]);

  const categories = [...new Set(items.map(p => p.category.name))];
  const filtered = items
    .filter(p => !search || p.name.includes(search))
    .filter(p => !catFilter || p.category.name === catFilter);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  async function confirmDelete() {
    if (!deleteId) return;
    setErrorMsg("");
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(p => p.id !== deleteId));
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        if (res.status === 401) {
          setErrorMsg("انتهت جلسة تسجيل الدخول. يرجى تسجيل الخروج وتسجيل الدخول مجدداً بالبيانات الجديدة.");
        } else {
          setErrorMsg(data?.error ?? "تعذر حذف المنتج.");
        }
      }
    } catch {
      setErrorMsg("حدث خطأ في الاتصال بالخادم أثناء الحذف.");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-sm font-semibold text-red-400">
          {errorMsg}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="بحث بالاسم..."
          className="flex-1 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm text-cream outline-none focus:border-gold transition placeholder:text-muted"
        />
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-bg-card px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
        >
          <option value="">جميع التصنيفات</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Link href="/dashboard/products/new" className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-bg hover:bg-gold-light transition text-center whitespace-nowrap">
          + إضافة منتج
        </Link>
      </div>

      <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right text-sm">
            <thead className="sticky top-0 bg-bg-card border-b border-border">
              <tr>
                <th className="p-3 text-right font-semibold text-muted text-xs">الصورة</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">الاسم</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">التصنيف</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">السعر</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">الحالة</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">أُضيف</th>
                <th className="p-3 text-right font-semibold text-muted text-xs">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product, i) => (
                <tr key={product.id} className={`border-b border-border/30 hover:bg-bg-hover transition ${i % 2 === 1 ? "bg-bg-hover/30" : ""}`}>
                  <td className="p-3">
                    {product.images[0] ? (
                      <img src={product.images[0].url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-light text-gold/30 text-xs">♛</span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-cream">{product.name}</td>
                  <td className="p-3 text-muted">{product.category.name}</td>
                  <td className="p-3 text-gold font-bold">{Number(product.price).toFixed(0)} ₪</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${product.inStock ? "bg-whatsapp/15 text-whatsapp" : "bg-red-500/15 text-red-400"}`}>
                      {product.inStock ? "متوفر" : "نفد"}
                    </span>
                  </td>
                  <td className="p-3 text-muted text-xs">{new Date(product.createdAt).toLocaleDateString("ar")}</td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <Link href={`/dashboard/products/${product.id}/edit`} className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-muted hover:text-gold hover:border-gold/30 transition">✏</Link>
                      <button onClick={() => setDeleteId(product.id)} className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-muted hover:text-red-400 hover:border-red-400/30 transition">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-12 text-center text-muted text-sm">لا توجد منتجات.</p>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-cream disabled:opacity-30 transition">→ السابق</button>
          <span className="text-xs text-muted px-2">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-cream disabled:opacity-30 transition">التالي ←</button>
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
