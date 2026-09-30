import { getSupabaseAdmin } from "@/lib/supabaseServer";
import { schedulePromiseEmail } from "@/lib/email";
import { choosePromise, getPromiseById } from "@/lib/promises";
import {
  chooseRandomCentralWorkdayTime,
  getCentralDateKey,
} from "@/lib/schedule";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const sendDate = getCentralDateKey(now);

  const { data: previousSend } = await supabase
    .from("daily_sends")
    .select("promise_id")
    .lt("send_date", sendDate)
    .order("send_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: existingDailySend, error: existingError } = await supabase
    .from("daily_sends")
    .select("*")
    .eq("send_date", sendDate)
    .maybeSingle();

  if (existingError) {
    console.error("Daily send lookup failed:", existingError);
    return Response.json({ error: "Daily send lookup failed." }, { status: 500 });
  }

  let dailySend = existingDailySend;

  if (!dailySend) {
    const promise = choosePromise(previousSend?.promise_id);
    const scheduledAt = chooseRandomCentralWorkdayTime(now);

    const { data, error } = await supabase
      .from("daily_sends")
      .insert([
        {
          send_date: sendDate,
          promise_id: promise.id,
          scheduled_at: scheduledAt.toISOString(),
          status: "scheduling",
        },
      ])
      .select("*")
      .single();

    if (error || !data) {
      console.error("Daily send creation failed:", error);
      return Response.json(
        { error: "Could not create today's send." },
        { status: 500 }
      );
    }

    dailySend = data;
  }

  const promise = getPromiseById(dailySend.promise_id);

  if (!promise) {
    return Response.json({ error: "Promise content not found." }, { status: 500 });
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id,email,unsubscribe_token")
    .eq("status", "active")
    .order("id", { ascending: true });

  if (usersError) {
    console.error("Active users lookup failed:", usersError);
    return Response.json({ error: "Could not load subscribers." }, { status: 500 });
  }

  let scheduledCount = 0;
  let failedCount = 0;

  for (const user of users ?? []) {
    if (!user.email || !user.unsubscribe_token) continue;

    const { data: existingLog } = await supabase
      .from("send_logs")
      .select("*")
      .eq("daily_send_id", dailySend.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingLog?.status === "scheduled" || existingLog?.status === "delivered") {
      scheduledCount += 1;
      continue;
    }

    let sendLog = existingLog;

    if (!sendLog) {
      const { data, error } = await supabase
        .from("send_logs")
        .insert([
          {
            daily_send_id: dailySend.id,
            user_id: user.id,
            promise_id: promise.id,
            scheduled_at: dailySend.scheduled_at,
            status: "pending",
          },
        ])
        .select("*")
        .single();

      if (error || !data) {
        console.error("Send log creation failed:", error);
        failedCount += 1;
        continue;
      }

      sendLog = data;
    }

    const { data: resendData, error: resendError } = await schedulePromiseEmail({
      to: user.email,
      promise,
      scheduledAt: dailySend.scheduled_at,
      sendLogId: sendLog.id,
      feedbackToken: sendLog.feedback_token,
      manageToken: user.unsubscribe_token,
    });

    if (resendError || !resendData?.id) {
      console.error("Resend schedule failed:", resendError);
      failedCount += 1;

      await supabase
        .from("send_logs")
        .update({
          status: "failed",
          failed_at: new Date().toISOString(),
          failure_reason: resendError?.message || "Unknown Resend error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sendLog.id);

      continue;
    }

    scheduledCount += 1;

    await supabase
      .from("send_logs")
      .update({
        status: "scheduled",
        resend_id: resendData.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sendLog.id);
  }

  await supabase
    .from("daily_sends")
    .update({
      status: failedCount > 0 ? "scheduled_with_errors" : "scheduled",
      recipient_count: users?.length ?? 0,
      scheduled_count: scheduledCount,
      failed_count: failedCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dailySend.id);

  return Response.json({
    sendDate,
    scheduledAt: dailySend.scheduled_at,
    promiseId: promise.id,
    recipients: users?.length ?? 0,
    scheduled: scheduledCount,
    failed: failedCount,
  });
}
