import { NextResponse } from "next/server";
import { metricsCookieValue } from "@/lib/metricsAuth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const secret = process.env.METRICS_SECRET;

  if (!secret || password !== secret) {
    return NextResponse.redirect(new URL("/metrics?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/metrics", request.url), 303);
  response.cookies.set("promises_metrics", metricsCookieValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
