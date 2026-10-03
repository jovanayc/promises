import { createHash, timingSafeEqual } from "crypto";

export function metricsCookieValue(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function isValidMetricsCookie(value: string | undefined, secret: string) {
  if (!value) return false;

  const expected = metricsCookieValue(secret);
  if (value.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
