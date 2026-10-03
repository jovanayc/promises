import { getPromiseById } from "@/lib/promises";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ sendId: string }>;
  searchParams: Promise<{ token?: string; thanks?: string }>;
}) {
  const { sendId } = await params;
  const { token, thanks } = await searchParams;

  if (!token) {
    return <InvalidFeedback />;
  }

  const supabase = getSupabaseAdmin();
  const { data: sendLog } = await supabase
    .from("send_logs")
    .select("id,promise_id,feedback_token")
    .eq("id", sendId)
    .eq("feedback_token", token)
    .maybeSingle();

  if (!sendLog) {
    return <InvalidFeedback />;
  }

  const promise = getPromiseById(sendLog.promise_id);

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-3xl">🕊️</p>
        <p className="mt-4 text-xs font-semibold tracking-[0.28em] text-white/55">
          PROMISES
        </p>

        {thanks ? (
          <>
            <h1 className="mt-7 text-3xl font-semibold">Thank you. ❤️</h1>
            <p className="mt-3 text-white/60">
              Your response helps Promises learn what encouragement resonates.
            </p>
          </>
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-7 text-left">
              <p className="font-serif text-2xl leading-relaxed">
                {promise?.text ?? "A Promise for your workday."}
              </p>
              {promise?.reference && (
                <p className="mt-4 text-sm text-white/50">{promise.reference}</p>
              )}
            </div>

            <p className="mt-7 text-white/65">Did this meet you at the right moment?</p>

            <form action={`/api/feedback/${sendId}`} method="post" className="mt-4">
              <input type="hidden" name="token" value={token} />
              <button
                name="reaction"
                value="needed_this"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-yellow-100"
              >
                ❤️ I needed this
              </button>
            </form>
          </>
        )}

        <a href="/" className="mt-10 inline-block text-sm text-white/45 underline">
          Back to Promises
        </a>
      </div>
    </main>
  );
}

function InvalidFeedback() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-3xl">🕊️</p>
        <h1 className="mt-6 text-2xl font-semibold">This feedback link is not valid.</h1>
        <a href="/" className="mt-8 inline-block underline">
          Back to Promises
        </a>
      </div>
    </main>
  );
}
