"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { productSchema } from "@/lib/dashboard-schemas";

type Category = { id: number; name: string };
type Image = { url: string; isPrimary: boolean; sortOrder: number };
type Product = { id: number; name: string; description: string; price: string; categoryId: number; inStock: boolean; images: Image[] };

const uploadFileSchema = z.instanceof(File).refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 5 * 1024 * 1024);

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>(product?.images ?? []);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputClass = "w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm text-cream outline-none focus:border-gold transition placeholder:text-muted";

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => uploadFileSchema.safeParse(file).success);
    if (validFiles.length !== files.length) setErrors({ images: "يسمح فقط بصور JPG/PNG/WEBP بحد أقصى 5MB" });
    else setErrors((e) => { const { images, ...rest } = e; return rest; });

    setBusy(true);
    try {
      const uploaded: Image[] = [];
      for (const file of validFiles) {
        const signRes = await fetch("/api/uploads/sign", { method: "POST" });
        if (!signRes.ok) throw new Error("sign_failed");
        const { uploadUrl } = await signRes.json();
        const body = new FormData();
        body.append("file", file);
        const uploadRes = await fetch(uploadUrl, { method: "POST", body });
        const result = await uploadRes.json();
        if (!result.secure_url) throw new Error("upload_failed");
        uploaded.push({ url: result.secure_url, isPrimary: images.length === 0 && uploaded.length === 0, sortOrder: images.length + uploaded.length });
      }
      setImages((c) => [...c, ...uploaded]);
    } catch {
      setErrors({ images: "تعذر رفع الصور. حاول مرة أخرى." });
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  function setPrimary(index: number) {
    setImages((c) => c.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function removeImage(index: number) {
    setImages((c) => c.filter((_, i) => i !== index).map((img, i) => ({ ...img, isPrimary: img.isPrimary || (index === 0 && i === 0), sortOrder: i })));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});

    const form = new FormData(event.currentTarget);
    const result = productSchema.safeParse({
      name: form.get("name"),
      description: form.get("description"),
      price: Number(form.get("price")),
      categoryId: Number(form.get("categoryId")),
      inStock: form.get("inStock") === "on",
      images,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setBusy(false);
      return;
    }

    try {
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("save_failed");
      router.push("/dashboard/products");
      router.refresh();
    } catch {
      setErrors({ form: "تعذر حفظ المنتج. تحقق من البيانات." });
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="rounded-xl bg-bg-card border border-border p-5 lg:p-6 mb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted">اسم المنتج</span>
            <input name="name" defaultValue={product?.name} required maxLength={160} className={inputClass} />
            {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted">الوصف</span>
            <textarea name="description" defaultValue={product?.description} required maxLength={5000} rows={4} className={inputClass} />
            {errors.description && <p className="text-red-400 text-[11px] mt-1">{errors.description}</p>}
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-muted">السعر (₪)</span>
            <div className="relative">
              <input name="price" type="number" min="0.01" step="0.01" defaultValue={product?.price} required className={`${inputClass} pl-10`} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">₪</span>
            </div>
            {errors.price && <p className="text-red-400 text-[11px] mt-1">{errors.price}</p>}
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-muted">التصنيف</span>
            <select name="categoryId" defaultValue={product?.categoryId} required className={inputClass}>
              <option value="">اختر تصنيفاً</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-400 text-[11px] mt-1">{errors.categoryId}</p>}
          </label>
        </div>

        <label className="flex items-center gap-3 mt-4 cursor-pointer">
          <div className="relative">
            <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} className="sr-only peer" />
            <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-gold transition" />
            <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-muted peer-checked:bg-bg peer-checked:translate-x-4 transition" />
          </div>
          <span className="text-sm text-cream">متوفر في المخزون</span>
        </label>

        <div className="mt-5">
          <span className="mb-2 block text-xs font-medium text-muted">صور المنتج</span>
          <label className="block rounded-lg border-2 border-dashed border-border hover:border-gold/40 bg-bg-light p-6 text-center cursor-pointer transition">
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadImages} className="hidden" />
            <span className="text-muted text-sm">اسحب الصور هنا أو اضغط للاختيار</span>
            <span className="block text-[10px] text-muted/50 mt-1">JPG, PNG, WEBP — حد أقصى 5MB</span>
          </label>
          {errors.images && <p className="text-red-400 text-[11px] mt-1">{errors.images}</p>}

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {images.map((image, index) => (
                <div key={`${image.url}-${index}`} className={`relative rounded-lg overflow-hidden border-2 ${image.isPrimary ? "border-gold" : "border-border"}`}>
                  <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                  <button type="button" onClick={() => setPrimary(index)} className={`absolute top-1 right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition ${image.isPrimary ? "bg-gold text-bg" : "bg-bg/80 text-muted hover:text-gold"}`}>
                    ★
                  </button>
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-600/90 text-[10px] text-white flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.form && <p className="text-red-400 text-sm mt-4 text-center">{errors.form}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:static bg-[#141414] border-t border-border lg:border-0 px-4 lg:px-0 py-3 lg:py-0 flex gap-3">
        <button type="submit" disabled={busy} className="rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-bg hover:bg-gold-light transition disabled:opacity-50">
          {busy ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        <a href="/dashboard/products" className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-muted hover:text-cream hover:border-gold/30 transition">
          إلغاء
        </a>
      </div>
    </form>
  );
}
