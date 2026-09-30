import { getSupabaseAdmin } from "@/lib/supabaseServer";

const WORK_HOURS_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const timezone = typeof body.timezone === "string" ? body.timezone.trim() : "";
    const workHours = typeof body.work_hours === "string" ? body.work_hours.trim() : "";

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Enter a valid work email address." },
        { status: 400 }
      );
    }

    if (!timezone || !isValidTimeZone(timezone)) {
      return Response.json(
        { error: "We could not detect a valid timezone. Please refresh and try again." },
        { status: 400 }
      );
    }

    if (!WORK_HOURS_PATTERN.test(workHours)) {
      return Response.json(
        { error: "Choose a valid start and end time." },
        { status: 400 }
      );
    }

    const [workStart, workEnd] = workHours.split("-");
    if (workStart === workEnd) {
      return Response.json(
        { error: "Your workday start and end times need to be different." },
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

    const { error: insertError } = await supabase.from("users").insert([
      {
        email,
        timezone,
        work_hours: workHours,
      },
    ]);

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
