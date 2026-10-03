import { Resend } from "resend";
import type { PromiseContent } from "@/lib/promises";

let resendClient: Resend | null = null;

// Create the Resend client on first use rather than at import time, so the
// build doesn't fail when RESEND_API_KEY isn't available during `next build`.
export function getResend() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY.");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export function getAppUrl() {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://promises-ten.vercel.app"
  ).replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderPromiseEmail({
  promise,
  feedbackUrl,
  manageUrl,
}: {
  promise: PromiseContent;
  feedbackUrl: string;
  manageUrl: string;
}) {
  const reference = promise.reference
    ? `<p style="margin:18px 0 0;color:#9f9f9f;font-size:14px;">${escapeHtml(
        promise.reference
      )}</p>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;background:#080808;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:48px 22px;">
      <div style="text-align:center;margin-bottom:30px;">
        <div style="font-size:30px;">🕊️</div>
        <div style="margin-top:12px;letter-spacing:0.3em;font-size:18px;font-weight:700;">PROMISES</div>
      </div>

      <div style="border:1px solid #252525;border-radius:22px;padding:34px 28px;background:#111111;">
        <p style="margin:0 0 12px;color:#d5bd71;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;">
          A quiet moment for your workday
        </p>
        <p style="margin:0;font-family:Georgia,serif;font-size:26px;line-height:1.5;color:#ffffff;">
          ${escapeHtml(promise.text)}
        </p>
        ${reference}
      </div>

      <div style="text-align:center;margin-top:28px;">
        <a href="${feedbackUrl}" style="display:inline-block;background:#ffffff;color:#0a0a0a;text-decoration:none;border-radius:999px;padding:13px 20px;font-size:14px;font-weight:700;">
          ❤️ I needed this
        </a>
      </div>

      <p style="margin:34px auto 0;max-width:430px;text-align:center;color:#777777;font-size:12px;line-height:1.6;">
        Promises sends one gentle reminder each workday at a shared random time between 9 AM and 4 PM CT.
        <br />
        <a href="${manageUrl}" style="color:#aaa;text-decoration:underline;">Pause or unsubscribe</a>
      </p>
    </div>
  </body>
</html>`;
}

export async function schedulePromiseEmail({
  to,
  promise,
  scheduledAt,
  sendLogId,
  feedbackToken,
  manageToken,
}: {
  to: string;
  promise: PromiseContent;
  scheduledAt: string;
  sendLogId: string;
  feedbackToken: string;
  manageToken: string;
}) {
  const appUrl = getAppUrl();
  const feedbackUrl = `${appUrl}/feedback/${sendLogId}?token=${feedbackToken}`;
  const manageUrl = `${appUrl}/manage/${manageToken}`;

  return getResend().emails.send(
    {
      from:
        process.env.PROMISES_FROM_EMAIL ||
        "Promises <onboarding@resend.dev>",
      to,
      subject: "A Promise for your workday",
      html: renderPromiseEmail({ promise, feedbackUrl, manageUrl }),
      scheduledAt,
      headers: {
        "List-Unsubscribe": `<${manageUrl}>`,
      },
      tags: [
        { name: "product", value: "promises" },
        { name: "promise_id", value: promise.id },
      ],
    },
    {
      idempotencyKey: `promise/${sendLogId}`,
    }
  );
}
