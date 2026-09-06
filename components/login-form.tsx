"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-muted mb-1.5">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          required
          placeholder="admin@arajeel.com"
          className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-cream outline-0 placeholder:text-muted/50 focus:border-gold transition"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-muted mb-1.5">كلمة المرور</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-cream outline-0 placeholder:text-muted/50 focus:border-gold transition"
        />
      </div>
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full disabled:opacity-50"
      >
        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
