import { getSupabaseAdmin } from "@/lib/supabaseServer";

export default async function ManagePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { token } = await params;
  const { updated } = await searchParams;
  const supabase = getSupabaseAdmin();

  const { data: user } = await supabase
    .from("users")
    .select("email,status")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-3xl">🕊️</p>
          <h1 className="mt-5 text-2xl font-semibold">This link is no longer valid.</h1>
          <p className="mt-3 text-white/60">
            If you want Promises again, you can sign up from the homepage.
          </p>
          <a className="mt-8 inline-block underline" href="/">
            Back to Promises
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="text-3xl">🕊️</p>
          <p className="mt-4 text-xs font-semibold tracking-[0.28em] text-white/55">
            PROMISES
          </p>
          <h1 className="mt-5 text-3xl font-semibold">Manage your Promises</h1>
          <p className="mt-3 text-white/60">{user.email}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          {updated && (
            <p className="mb-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm">
              Your preferences were updated.
            </p>
          )}

          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="font-medium">Current status</p>
              <p className="mt-1 text-sm text-white/55">
                One Promise each weekday between 9 AM and 4 PM CT.
              </p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs capitalize text-white/75">
              {user.status}
            </span>
          </div>

          <form action={`/api/manage/${token}`} method="post" className="mt-6 grid gap-3">
            {user.status === "active" ? (
              <button
                name="action"
                value="pause"
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/5"
              >
                Pause Promises
              </button>
            ) : (
              <button
                name="action"
                value="resume"
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-yellow-100"
              >
                Resume Promises
              </button>
            )}

            {user.status !== "unsubscribed" && (
              <button
                name="action"
                value="unsubscribe"
                className="rounded-xl px-4 py-3 text-sm text-white/55 hover:text-white"
              >
                Unsubscribe
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
