create table jobs (
  id bigserial primary key,
  name text not null,
  payload jsonb not null,
  concurrency_key text,
  run_at timestamptz not null default now(),
  attempt int not null default 0,
  leased_until timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  last_error text
);

create index jobs_runnable on jobs (run_at, id) where completed_at is null and failed_at is null;
create index jobs_concurrency_key on jobs (concurrency_key, id) where completed_at is null and failed_at is null;

create table job_steps (
  job_id bigint not null references jobs (id),
  key text not null,
  result jsonb,
  primary key (job_id, key)
);
