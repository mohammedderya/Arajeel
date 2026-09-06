export function TopBar() {
  return (
    <div className="w-full border-b border-[#2A3028]/50 bg-[#171C1A]/80 text-xs text-[#A9AFA8]">
      <div className="mx-auto flex max-w-[1200px] w-[calc(100%-40px)] flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center sm:gap-x-6">
        <span className="font-bold text-[#D5AB57]">أسعار التوصيل:</span>
        <span>الضفة <strong className="text-[#E8DDC9]">٢٠₪</strong></span>
        <span>القدس <strong className="text-[#E8DDC9]">٣٠₪</strong></span>
        <span>أبو غوش، عين رافة، بيت نقويا <strong className="text-[#E8DDC9]">٥٠₪</strong></span>
        <span>الداخل <strong className="text-[#E8DDC9]">٧٠₪</strong></span>
      </div>
    </div>
  );
}
