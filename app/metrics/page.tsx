import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import { isValidMetricsCookie } from "@/lib/metricsAuth";

async function countRows(
  table: string,
  filter?: { column: string; value: string }
) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from(table).select("*", { count: "exact", head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count } = await query;
  return count ?? 0;
}

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const secret = process.env.METRICS_SECRET;
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("promises_metrics")?.value;
  const { error } = await searchParams;

  if (!secret || !isValidMetricsCookie(authCookie, secret)) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-md">
          <p className="text-center text-3xl">🕊️</p>
          <h1 className="mt-5 text-center text-3xl font-semibold">Promises metrics</h1>
          <p className="mt-3 text-center text-white/55">
            Private product dashboard
          </p>

          <form
            action="/api/metrics/login"
            method="post"
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <label className="text-sm text-white/70">
              Dashboard password
              <input
                type="password"
                name="password"
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none"
              />
            </label>
            {error && (
              <p className="mt-3 text-sm text-red-200">That password did not match.</p>
            )}
            <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
              View metrics
            </button>
          </form>
        </div>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const [
    totalUsers,
    activeUsers,
    pausedUsers,
    unsubscribedUsers,
    scheduledEmails,
    deliveredEmails,
    failedEmails,
    feedbackCount,
    pageViews,
    signups,
  ] = await Promise.all([
    countRows("users"),
    countRows("users", { column: "status", value: "active" }),
    countRows("users", { column: "status", value: "paused" }),
    countRows("users", { column: "status", value: "unsubscribed" }),
    countRows("send_logs", { column: "status", value: "scheduled" }),
    countRows("send_logs", { column: "status", value: "delivered" }),
    countRows("send_logs", { column: "status", value: "failed" }),
    countRows("feedback"),
    countRows("events", { column: "event_name", value: "page_view" }),
    countRows("events", { column: "event_name", value: "signup_completed" }),
  ]);

  const { count: openedEmails } = await supabase
    .from("send_logs")
    .select("*", { count: "exact", head: true })
    .not("opened_at", "is", null);

  const { count: clickedEmails } = await supabase
    .from("send_logs")
    .select("*", { count: "exact", head: true })
    .not("clicked_at", "is", null);

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: retainedEligible } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .lt("created_at", cutoff);

  const { count: retainedActive } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .lt("created_at", cutoff)
    .eq("status", "active");

  const conversion =
    pageViews > 0 ? Math.round((signups / pageViews) * 1000) / 10 : 0;
  const retention =
    (retainedEligible ?? 0) > 0
      ? Math.round(((retainedActive ?? 0) / (retainedEligible ?? 1)) * 1000) / 10
      : 0;

  const cards = [
    ["Total subscribers", totalUsers],
    ["Active subscribers", activeUsers],
    ["Paused", pausedUsers],
    ["Unsubscribed", unsubscribedUsers],
    ["Landing page views", pageViews],
    ["Signup conversion", `${conversion}%`],
    ["Emails scheduled", scheduledEmails],
    ["Emails delivered", deliveredEmails],
    ["Delivery failures", failedEmails],
    ["Opened", openedEmails ?? 0],
    ["Clicked", clickedEmails ?? 0],
    ["❤️ I needed this", feedbackCount],
    ["7-day retained", `${retention}%`],
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-white/50">
              PROMISES
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Product metrics</h1>
            <p className="mt-2 text-sm text-white/55">
              Signup, delivery, engagement, and retention signals.
            </p>
          </div>
          <form action="/api/metrics/logout" method="post">
            <button className="text-sm text-white/45 underline">Log out</button>
          </form>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-white/50">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/35">
          Open and click tracking depend on Resend tracking settings and can be
          affected by privacy protections and email security scanners.
        </p>
      </div>
    </main>
  );
}
