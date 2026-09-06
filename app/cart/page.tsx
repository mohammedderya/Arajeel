"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/storefront/site-header";
import { Footer } from "@/components/storefront/footer";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <SiteHeader />
        <main className="mx-auto flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-display text-2xl font-bold text-cream mb-2">سلة المشتريات فارغة</h1>
          <p className="text-muted text-sm mb-6">لم تضف أي منتجات بعد. تصفح منتجاتنا وابدأ التسوق!</p>
          <Link href="/" className="btn-gold inline-flex items-center gap-2">
            تصفح المنتجات
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-gold transition">الرئيسية</Link>
          <span>/</span>
          <span className="text-cream">سلة المشتريات</span>
        </nav>

        <h1 className="font-display text-2xl font-bold text-cream mb-6">
          سلة المشتريات <span className="text-muted text-base">({totalItems} منتج)</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl bg-bg-card border border-border p-4">
                <Link href={`/products/${item.id}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-bg-hover">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl text-gold/20 font-display">ب</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`} className="block">
                    <h3 className="font-bold text-cream text-sm mb-1 line-clamp-1 hover:text-gold transition">{item.name}</h3>
                  </Link>
                  <p className="text-gold font-extrabold text-lg">{Number(item.price).toFixed(0)} ₪</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:bg-bg-hover transition text-sm"
                      >
                        −
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-cream text-sm font-bold border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:bg-bg-hover transition text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-red-400 transition text-sm flex items-center gap-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl bg-bg-card border border-border p-6 h-fit sticky top-24">
            <h2 className="font-display text-lg font-bold text-cream mb-4">ملخص الطلب</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted truncate max-w-[180px]">{item.name} × {item.quantity}</span>
                  <span className="text-cream font-bold">{(Number(item.price) * item.quantity).toFixed(0)} ₪</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted text-sm">المجموع الفرعي</span>
                <span className="text-cream font-bold">{totalPrice.toFixed(0)} ₪</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted text-sm">الشحن</span>
                <span className="text-whatsapp font-bold text-sm">مجاني</span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-border">
                <span className="text-cream font-bold">الإجمالي</span>
                <span className="text-gold font-extrabold text-xl">{totalPrice.toFixed(0)} ₪</span>
              </div>
            </div>

            <a
              href={`https://wa.me/970590000000?text=${encodeURIComponent(
                "مرحباً، أريد طلب:\n" +
                items.map((item) => `• ${item.name} (${item.quantity}×${item.price}₪)`).join("\n") +
                `\n\nالمجموع: ${totalPrice.toFixed(0)}₪`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-social-whatsapp w-full mb-3 text-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              إتمام الطلب عبر واتساب
            </a>

            <button
              onClick={clearCart}
              className="w-full rounded-xl border border-border py-2.5 text-sm font-bold text-muted hover:text-red-400 hover:border-red-400/30 transition"
            >
              تفريغ السلة
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
