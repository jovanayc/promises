import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const formData = await request.formData();
  const action = String(formData.get("action") || "");
  const supabase = getSupabaseAdmin();

  const allowedActions = ["pause", "resume", "unsubscribe"];

  if (!allowedActions.includes(action)) {
    return new Response("Invalid action", { status: 400 });
  }

  const now = new Date().toISOString();
  const update =
    action === "pause"
      ? { status: "paused", paused_at: now, updated_at: now }
      : action === "unsubscribe"
        ? { status: "unsubscribed", unsubscribed_at: now, paused_at: null, updated_at: now }
        : { status: "active", unsubscribed_at: null, paused_at: null, updated_at: now };

  const { data: user, error } = await supabase
    .from("users")
    .update(update)
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();

  if (error || !user) {
    return new Response("Unable to update subscription", { status: 404 });
  }

  await supabase.from("events").insert([
    {
      event_name:
        action === "unsubscribe"
          ? "unsubscribe"
          : action === "pause"
            ? "pause"
            : "resume",
      metadata: {},
    },
  ]);

  return NextResponse.redirect(
    new URL(`/manage/${token}?updated=1`, request.url),
    303
  );
}
