-- Saved core–satellite proposals, one row per save, scoped to the advisor.
create table if not exists proposals (
  id             text primary key,
  user_id        text not null,
  client_name    text not null,
  advisor_name   text not null,
  advisor_email  text not null,
  policy_code    text not null,
  policy_title   text not null,
  snapshot       text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists proposals_user_updated_idx
  on proposals (user_id, updated_at desc);
