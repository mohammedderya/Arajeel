"use client";

import { useCart } from "@/lib/cart-context";

type Props = {
  id: number;
  name: string;
  price: string;
  image: string | null;
};

export function AddToCartButton({ id, name, price, image }: Props) {
  const { addItem } = useCart();

  function handleClick() {
    addItem({ id, name, price, image });
  }

  return (
    <button
      onClick={handleClick}
      className="btn-gold w-full flex items-center justify-center gap-2"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      أضف إلى السلة
    </button>
  );
}
