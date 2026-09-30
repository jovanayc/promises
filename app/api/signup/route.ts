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
      .select("id")
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

    if (existingUser) {
      return Response.json(
        {
          error: "That email is already receiving Promises.",
          code: "ALREADY_SUBSCRIBED",
        },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase.from("users").insert([{ email }]);

    if (insertError) {
      console.error("Signup insert failed:", insertError);
      return Response.json(
        { error: "We could not save your signup. Please try again." },
        { status: 500 }
      );
    }

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
