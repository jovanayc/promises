# Promises

Promises is a lightweight email product that places small moments of faith and encouragement inside an environment that is often associated with requests, deadlines, and stress: the work inbox.

Instead of asking people to adopt another wellness app, Promises delivers one Scripture or original faith-filled reminder each weekday at a shared random time between **9 AM and 4 PM Central Time**.

## Product experience

1. A visitor enters a work email.
2. The subscriber is stored in Supabase.
3. A weekday Vercel Cron run prepares that day's send before the delivery window.
4. Promises selects one item from the content library and one random shared delivery time.
5. Resend schedules the email for every active subscriber.
6. Delivery events are written back through the verified Resend webhook.
7. Recipients can tap **❤️ I needed this**, pause, resume, or unsubscribe.
8. A private metrics dashboard summarizes signup, delivery, engagement, and retention signals.

## Stack

- **Next.js 16 / React 19** — product UI and server routes
- **Tailwind CSS 4** — styling
- **Supabase / Postgres** — subscribers, send history, feedback, analytics
- **Resend** — scheduled transactional email and delivery webhooks
- **Vercel** — hosting and weekday cron
- **GitHub** — source control and deployment integration

## Key routes

- `/` — landing page and signup
- `/api/signup` — validated subscriber creation/reactivation
- `/api/cron` — protected daily scheduler
- `/feedback/[sendId]` — recipient feedback
- `/manage/[token]` — pause/resume/unsubscribe
- `/api/resend/webhook` — signed delivery-event ingestion
- `/metrics` — password-protected product metrics

## Local setup

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Create `.env.local` in the repository root.

### Required environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
PROMISES_FROM_EMAIL=

CRON_SECRET=
METRICS_SECRET=

APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never commit secret values. The repository ignores `.env*`.

## Database

Run:

`supabase/migrations/001_production_schema.sql`

The migration adds subscriber state, daily send records, per-recipient send logs, feedback, and lightweight product events. RLS is enabled on application tables. Server routes use the Supabase service-role key, so public database policies are intentionally not required for these tables.

## Scheduling model

The Vercel cron runs once each weekday before the Central Time delivery window. It creates one daily send and chooses a shared random delivery time between 9:00 AM and 3:59 PM CT. Resend's scheduled-email API holds each email until that timestamp.

This lets the Hobby-plan cron stay daily while the recipient experience still happens at a random time. Each per-recipient email uses an idempotency key, and daily/send-log uniqueness prevents accidental duplicate scheduling.

## Email content

Scripture currently uses KJV references. Original encouragement is stored in `lib/promises.ts`. Avoid adding unlicensed song lyrics or copyrighted Bible translations without confirming usage rights.

## Resend production setup

1. Verify a sending domain in Resend.
2. Set `PROMISES_FROM_EMAIL` to a verified sender, for example `Promises <hello@yourdomain.com>`.
3. Create a webhook pointing to:
   `https://YOUR_DOMAIN/api/resend/webhook`
4. Subscribe to email events such as scheduled, sent, delivered, failed, bounced, opened, and clicked.
5. Save its signing secret as `RESEND_WEBHOOK_SECRET`.

Open/click data should be interpreted cautiously because privacy protections and security scanners can distort those signals.

## Metrics

Visit `/metrics` and sign in with the value of `METRICS_SECRET`.

The dashboard includes:
- visitors and signup conversion
- total / active / paused / unsubscribed subscribers
- scheduled / delivered / failed emails
- opens and clicks when available
- ❤️ feedback
- simple 7-day subscriber retention

## Production checklist

- Apply the Supabase migration.
- Set all required Vercel environment variables for Production and Preview.
- Verify a Resend sending domain.
- Configure the signed Resend webhook.
- Test signup → database → scheduled email → feedback → pause/resume/unsubscribe.
- Confirm mobile and desktop rendering.
- Recruit a small real-user beta and use the metrics dashboard to document outcomes.

## Portfolio framing

> I noticed that the work inbox is often associated with requests, deadlines, and stress. Instead of asking users to adopt another wellness app, I inserted small positive moments into an existing daily behavior. I independently took the idea from problem → product concept → UX → technical architecture → build → launch → measurement.
