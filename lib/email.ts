import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPromiseEmail(to: string, subject: string, text: string) {
  return resend.emails.send({
    from: "Promises <onboarding@resend.dev>", // change later when domain verified
    to,
    subject,
    text,
  });
}
