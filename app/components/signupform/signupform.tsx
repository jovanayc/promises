"use client";

import { useState } from "react";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const timezone = (form.elements.namedItem("timezone") as HTMLInputElement).value;
    const work_hours = (form.elements.namedItem("work_hours") as HTMLInputElement).value;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, timezone, work_hours }),
    });

    const result = await res.json();
    alert(result.message || result.error);

    setLoading(false);
  }

  return (
    <form
      className="mt-6 grid gap-3 sm:grid-cols-3"
      onSubmit={handleSubmit}
    >
      <input
        name="email"
        type="email"
        placeholder="Work email"
        className="rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm outline-none focus:border-yellow-200/60"
        required
      />

      <input
        name="timezone"
        type="text"
        placeholder="Timezone (e.g., EST)"
        className="rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm outline-none focus:border-yellow-200/60"
        required
      />

      <input
        name="work_hours"
        type="text"
        placeholder="Work hours (e.g., 9–5)"
        className="rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm outline-none focus:border-yellow-200/60"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="sm:col-span-3 mt-2 rounded-xl bg-white text-black py-3 text-sm font-semibold hover:bg-yellow-100 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Get Daily Promises →"}
      </button>
    </form>
  );
}
