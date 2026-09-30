import { getSupabaseAdmin } from "@/lib/supabaseServer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Enter a valid work email address." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existingUser, error: lookupError } = await supabase
      .from("users")
      .select("id,status")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      console.error("Signup duplicate lookup failed:", lookupError);
      return Response.json(
        { error: "We could not complete your signup. Please try again." },
        { status: 500 }
      );
    }

    if (existingUser?.status === "active") {
      return Response.json(
        {
          error: "That email is already receiving Promises.",
          code: "ALREADY_SUBSCRIBED",
        },
        { status: 409 }
      );
    }

    if (existingUser) {
      const { error: reactivateError } = await supabase
        .from("users")
        .update({
          status: "active",
          paused_at: null,
          unsubscribed_at: null,
          unsubscribe_token: crypto.randomUUID(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingUser.id);

      if (reactivateError) {
        console.error("Signup reactivation failed:", reactivateError);
        return Response.json(
          { error: "We could not reactivate your signup. Please try again." },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabase.from("users").insert([
        {
          email,
          status: "active",
          unsubscribe_token: crypto.randomUUID(),
        },
      ]);

      if (insertError) {
        console.error("Signup insert failed:", insertError);
        return Response.json(
          { error: "We could not save your signup. Please try again." },
          { status: 500 }
        );
      }
    }

    await supabase.from("events").insert([
      {
        event_name: "signup_completed",
        metadata: { source: "landing_page" },
      },
    ]);

    return Response.json(
      {
        message: "Your work inbox just got a little lighter.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup route error:", error);
    return Response.json(
      { error: "We could not complete your signup. Please try again." },
      { status: 500 }
    );
  }
}
