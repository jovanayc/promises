"use client";

import { useState } from "react";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: result.message || "Your work inbox just got a little lighter.",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message: "We could not reach Promises. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (status.type === "success") {
    return (
      <div
        className="mt-6 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-5 text-left"
        role="status"
      >
        <p className="text-sm font-semibold text-white">{status.message}</p>
        <p className="mt-1 text-sm text-white/65">
          Watch for one Promise each workday between 9 AM and 4 PM CT.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
      <label className="text-left">
        <span className="mb-1.5 block text-xs font-medium text-white/65">
          Work email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-200/60"
          required
        />
      </label>

      {status.type === "error" && (
        <div
          className="rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-left text-sm text-red-100"
          role="alert"
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving..." : "Get Daily Promises →"}
      </button>
    </form>
  );
}
