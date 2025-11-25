import { supabase } from "@/lib/supabaseClient";
import { sendPromiseEmail } from "@/lib/email";

function isWithinWorkHours(workHours: string, userTz: string) {
  // MVP: super simple. Expect something like "9-5" or "9–17"
  // We'll improve later. For now return true so you can test end-to-end.
  return true;
}

const PROMISES = [
  { tag: "peace", text: "He will keep you in perfect peace. Isaiah 26:3" },
  { tag: "rest", text: "Come to Me…and I will give you rest. Matthew 11:28" },
  { tag: "hope", text: "Those who hope in the Lord will renew their strength. Isaiah 40:31" },
];

export async function GET(request: Request) {
  // ✅ Protect endpoint: only Vercel cron can call it
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: users, error } = await supabase.from("users").select("*");
  if (error) return new Response(error.message, { status: 500 });

  for (const u of users ?? []) {
    if (!u.email) continue;

    if (!isWithinWorkHours(u.work_hours, u.timezone)) continue;

    const promise = PROMISES[Math.floor(Math.random() * PROMISES.length)];

    await sendPromiseEmail(
      u.email,
      "Promises",
      promise.text
    );
  }

  return new Response("Cron ran", { status: 200 });
}
