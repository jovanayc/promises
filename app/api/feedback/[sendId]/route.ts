import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sendId: string }> }
) {
  const { sendId } = await params;
  const formData = await request.formData();
  const token = String(formData.get("token") || "");
  const reaction = String(formData.get("reaction") || "");

  if (reaction !== "needed_this" || !token) {
    return new Response("Invalid feedback", { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: sendLog } = await supabase
    .from("send_logs")
    .select("id,user_id")
    .eq("id", sendId)
    .eq("feedback_token", token)
    .maybeSingle();

  if (!sendLog) {
    return new Response("Invalid feedback link", { status: 404 });
  }

  const { error } = await supabase.from("feedback").upsert(
    [
      {
        send_log_id: sendLog.id,
        user_id: sendLog.user_id,
        reaction,
      },
    ],
    { onConflict: "send_log_id,user_id" }
  );

  if (error) {
    console.error("Feedback save failed:", error);
    return new Response("Unable to save feedback", { status: 500 });
  }

  await supabase.from("events").insert([
    {
      event_name: "promise_feedback",
      metadata: { reaction },
    },
  ]);

  return NextResponse.redirect(
    new URL(`/feedback/${sendId}?token=${token}&thanks=1`, request.url),
    303
  );
}
