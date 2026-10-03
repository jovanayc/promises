import { getSupabaseAdmin } from "@/lib/supabaseServer";

const ALLOWED_EVENTS = new Set(["page_view"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventName = typeof body.event_name === "string" ? body.event_name : "";
    const anonymousId =
      typeof body.anonymous_id === "string" ? body.anonymous_id.slice(0, 100) : null;

    if (!ALLOWED_EVENTS.has(eventName)) {
      return Response.json({ error: "Invalid event." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("events").insert([
      {
        anonymous_id: anonymousId,
        event_name: eventName,
        metadata: {},
      },
    ]);

    if (error) {
      console.error("Analytics event failed:", error);
      return Response.json({ error: "Unable to record event." }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
}
