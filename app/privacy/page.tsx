export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <article className="mx-auto max-w-2xl">
        <a href="/" className="text-sm text-white/45 underline">← Promises</a>
        <h1 className="mt-8 text-3xl font-semibold">Privacy</h1>
        <p className="mt-4 leading-relaxed text-white/65">
          Promises stores the email address you submit so it can send you weekday
          encouragement. It also stores delivery status, subscription status, and
          lightweight product events such as page views and feedback.
        </p>
        <p className="mt-4 leading-relaxed text-white/65">
          Promises does not sell your information. You can pause or unsubscribe
          from the link in any Promise email. Delivery, open, and click signals may
          be provided by the email delivery service and can be affected by mail
          privacy features or security scanners.
        </p>
        <p className="mt-4 leading-relaxed text-white/65">
          The product is an early-stage project. This page will be updated as the
          service and its data practices evolve.
        </p>
      </article>
    </main>
  );
}
