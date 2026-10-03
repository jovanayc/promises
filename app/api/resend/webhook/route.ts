import { getResend } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

type ResendEvent = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    [key: string]: unknown;
  };
};

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Webhook secret is not configured", { status: 500 });
  }

  try {
    const payload = await request.text();

    const event = getResend().webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") || "",
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
      webhookSecret,
    }) as ResendEvent;

    const emailId = event.data?.email_id;
    if (!emailId || !event.type) {
      return Response.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    const now = event.created_at || new Date().toISOString();
    const update: Record<string, string> = { updated_at: now };

    if (event.type === "email.sent") {
      update.status = "sent";
    } else if (event.type === "email.delivered") {
      update.status = "delivered";
      update.delivered_at = now;
    } else if (event.type === "email.opened") {
      update.opened_at = now;
    } else if (event.type === "email.clicked") {
      update.clicked_at = now;
    } else if (
      event.type === "email.failed" ||
      event.type === "email.bounced" ||
      event.type === "email.complained"
    ) {
      update.status = "failed";
      update.failed_at = now;
      update.failure_reason = event.type;
    } else if (event.type === "email.scheduled") {
      update.status = "scheduled";
    } else {
      return Response.json({ ok: true });
    }

    const { error } = await supabase
      .from("send_logs")
      .update(update)
      .eq("resend_id", emailId);

    if (error) {
      console.error("Resend webhook update failed:", error);
      return new Response("Database update failed", { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Invalid Resend webhook:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
