"use client";

export function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="w-full max-w-[380px] rounded-xl bg-bg-card border border-border p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-3xl mb-3">⚠</div>
        <h3 className="font-bold text-cream text-lg mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition">
            نعم، احذف
          </button>
          <button onClick={onCancel} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-bold text-muted hover:text-cream hover:border-gold/30 transition">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
