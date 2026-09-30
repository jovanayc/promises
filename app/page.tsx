import SignupForm from "./components/signupform/signupform";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* subtle star field */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f7d774_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        {/* dove icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.08)]">
            <span className="text-3xl">🕊️</span>
          </div>
        </div>

        <h1 className="tracking-[0.35em] text-4xl sm:text-5xl font-semibold">
          PROMISES
        </h1>

        <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
          Daily reminders of God's promises delivered gently into your workday.
        </p>

        {/* CTA card */}
        <div className="mt-10 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-md shadow-[0_0_80px_rgba(247,215,116,0.06)]">
          <p className="text-lg sm:text-xl font-medium">For Daily Faith</p>
          <p className="mt-2 text-white/70">
            Scripture, gospel-inspired encouragement, and personal memos sent to
            your work email once each workday at a random time between 9 AM and
            4 PM CT.
          </p>

          <SignupForm />

          <p className="mt-4 text-xs text-white/50">
            Free • No Ads • Just for you
          </p>
        </div>

        {/* 3-step mini explainer */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/80">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg mb-1">📩</div>
            Add your work email
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg mb-1">✨</div>
            We choose the moment
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-lg mb-1">🕊️</div>
            Receive your Promise
          </div>
        </div>

        <p className="mt-12 text-xs text-white/40 italic">
          “Great is His faithfulness.”
        </p>
      </section>
    </main>
  );
}
