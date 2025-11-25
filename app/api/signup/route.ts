import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { email, timezone, work_hours } = await request.json();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          timezone,
          work_hours
        }
      ]);

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Saved successfully!" }), { status: 200 });

  } catch (err: any) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
