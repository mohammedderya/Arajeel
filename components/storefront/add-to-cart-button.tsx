"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type Props = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  compact?: boolean;
};

export function AddToCartButton({ id, name, price, image, compact = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        type="button"
        title="أضف إلى السلة"
        className="flex items-center justify-center rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-bg transition p-2 w-10 h-8"
      >
        {added ? (
          <span className="text-xs font-bold text-whatsapp">✓</span>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn-gold w-full flex items-center justify-center gap-2"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      {added ? "تمت الإضافة للسلة ✓" : "أضف إلى السلة"}
    </button>
  );
}
