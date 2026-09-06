"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categorySchema } from "@/lib/dashboard-schemas";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";

type Category = { id: number; name: string; slug: string; imageUrl: string | null; _count: { products: number } };

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function save() {
    const parsed = categorySchema.safeParse({ name, imageUrl: undefined });
    if (!parsed.success) { setMessage("أدخل اسماً صحيحاً."); return; }
    setMessage("");
    const res = await fetch(editing ? `/api/categories/${editing}` : "/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage(data?.error ?? "تعذر الحفظ.");
      return;
    }
    setName(""); setEditing(null); setShowAdd(false); router.refresh();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage(data?.error ?? "تعذر الحذف.");
    }
    setDeleteId(null);
    router.refresh();
  }

  function startEdit(cat: Category) {
    setEditing(cat.id);
    setName(cat.name);
    setShowAdd(true);
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => { setEditing(null); setName(""); setShowAdd(true); }} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-bg hover:bg-gold-light transition">
          + إضافة تصنيف
        </button>
      </div>

      {message && <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center mb-4">{message}</p>}

      <div className="rounded-xl bg-bg-card border border-border overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="sticky top-0 bg-bg-card border-b border-border">
            <tr>
              <th className="p-3 text-right font-semibold text-muted text-xs">الاسم</th>
              <th className="p-3 text-right font-semibold text-muted text-xs">الرابط</th>
              <th className="p-3 text-right font-semibold text-muted text-xs">المنتجات</th>
              <th className="p-3 text-right font-semibold text-muted text-xs">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} className={`border-b border-border/30 hover:bg-bg-hover transition ${i % 2 === 1 ? "bg-bg-hover/30" : ""}`}>
                <td className="p-3 font-medium text-cream">{cat.name}</td>
                <td className="p-3 text-muted text-xs">/{cat.slug}</td>
                <td className="p-3 text-muted">{cat._count.products}</td>
                <td className="p-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(cat)} className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-muted hover:text-gold hover:border-gold/30 transition">✏</button>
                    <button onClick={() => setDeleteId(cat.id)} className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-muted hover:text-red-400 hover:border-red-400/30 transition">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-12 text-center text-muted text-sm">لا توجد تصنيفات.</p>}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-[400px] rounded-xl bg-bg-card border border-border p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-cream mb-4">{editing ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم التصنيف"
              className="w-full rounded-lg border border-border bg-bg-light px-4 py-2.5 text-sm text-cream outline-none focus:border-gold transition placeholder:text-muted mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={save} className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-bold text-bg hover:bg-gold-light transition">حفظ</button>
              <button onClick={() => { setShowAdd(false); setEditing(null); setName(""); }} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-bold text-muted hover:text-cream transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="حذف التصنيف"
        message="هل أنت متأكد؟ إذا كان التصنيف يحتوي منتجات، يجب نقلها أو حذفها أولاً."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
