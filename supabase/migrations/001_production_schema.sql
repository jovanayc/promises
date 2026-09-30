-- Promises production schema
-- Run this migration in Supabase before using the production routes.

alter table public.users
  add column if not exists status text not null default 'active',
  add column if not exists unsubscribe_token uuid default gen_random_uuid(),
  add column if not exists paused_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.users
set unsubscribe_token = gen_random_uuid()
where unsubscribe_token is null;

create unique index if not exists users_email_unique_ci
  on public.users (lower(email));

create unique index if not exists users_unsubscribe_token_unique
  on public.users (unsubscribe_token);

alter table public.users enable row level security;

create table if not exists public.daily_sends (
  id uuid primary key default gen_random_uuid(),
  send_date date not null unique,
  promise_id text not null,
  scheduled_at timestamptz not null,
  status text not null default 'scheduling',
  recipient_count integer not null default 0,
  scheduled_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.daily_sends enable row level security;

create table if not exists public.send_logs (
  id uuid primary key default gen_random_uuid(),
  daily_send_id uuid not null references public.daily_sends(id) on delete cascade,
  user_id bigint not null references public.users(id) on delete cascade,
  promise_id text not null,
  resend_id text,
  feedback_token uuid not null default gen_random_uuid(),
  status text not null default 'pending',
  scheduled_at timestamptz not null,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (daily_send_id, user_id),
  unique (feedback_token)
);

alter table public.send_logs enable row level security;

create index if not exists send_logs_resend_id_idx
  on public.send_logs (resend_id);

create index if not exists send_logs_user_id_idx
  on public.send_logs (user_id);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  send_log_id uuid not null references public.send_logs(id) on delete cascade,
  user_id bigint not null references public.users(id) on delete cascade,
  reaction text not null,
  created_at timestamptz not null default now(),
  unique (send_log_id, user_id)
);

alter table public.feedback enable row level security;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create index if not exists events_name_created_idx
  on public.events (event_name, created_at desc);

-- The application uses the service-role key on the server.
-- No public RLS policies are required for these tables.
