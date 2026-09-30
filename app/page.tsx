import AnalyticsTracker from "./components/AnalyticsTracker";
import SignupForm from "./components/signupform/signupform";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AnalyticsTracker />

      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f7d774_1px,transparent_1px)] [background-size:82px_82px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <span className="text-3xl">🕊️</span>
        </div>

        <p className="text-xs font-semibold tracking-[0.35em] text-white/45">
          A SMALLER, GENTLER WORKDAY
        </p>

        <h1 className="mt-5 text-4xl font-semibold tracking-[0.28em] sm:text-6xl">
          PROMISES
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
          Your inbox asks things from you all day. Promises puts something back.
        </p>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
          Receive one Scripture or gentle faith-filled reminder at a shared random
          moment between 9 AM and 4 PM CT each weekday.
        </p>

        <div className="mt-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-[0_0_90px_rgba(247,215,116,0.07)] backdrop-blur-md sm:px-9">
          <p className="text-xl font-medium">Make your inbox feel a little lighter.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/55">
            No new app to remember. No feed to scroll. Just a quiet reminder delivered
            where your workday already happens.
          </p>

          <SignupForm />

          <p className="mt-4 text-xs text-white/40">
            Free • No ads • Pause or unsubscribe anytime
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 text-left text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg">📩</div>
            <p className="mt-3 font-medium">Add your work email</p>
            <p className="mt-1 text-white/45">One field. That&apos;s it.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg">✨</div>
            <p className="mt-3 font-medium">We choose the moment</p>
            <p className="mt-1 text-white/45">A random weekday pause between 9–4 CT.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg">🕊️</div>
            <p className="mt-3 font-medium">Receive your Promise</p>
            <p className="mt-1 text-white/45">Scripture or original encouragement.</p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 text-xs text-white/35">
          <a href="/privacy" className="hover:text-white/65">Privacy</a>
          <span>•</span>
          <span>“Great is His faithfulness.”</span>
        </div>
      </section>
    </main>
  );
}
