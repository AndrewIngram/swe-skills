import type { Db, Queryable, Transaction } from "@ledgerly/db";
import type { JobDefinition } from "./define";

export interface EnqueueOptions {
  /** Write the job in this transaction. */
  tx?: Transaction;
  /** Earliest time the job may run. Defaults to now. */
  runAt?: Date;
}

export interface JobsClient {
  enqueue<Payload>(job: JobDefinition<Payload>, payload: Payload, options?: EnqueueOptions): Promise<string>;
}

export function createClient(db: Db): JobsClient {
  return {
    enqueue(job, payload, options = {}) {
      return insertJob(options.tx ?? db, job, payload, options.runAt);
    },
  };
}

export async function insertJob<Payload>(
  runner: Queryable,
  job: JobDefinition<Payload>,
  payload: Payload,
  runAt: Date | undefined,
): Promise<string> {
  const [row] = await runner.query<{ id: string }>(
    `insert into jobs (name, payload, concurrency_key, run_at)
     values ($1, $2, $3, coalesce($4, now()))
     returning id`,
    [job.name, JSON.stringify(payload), job.concurrencyKey?.(payload) ?? null, runAt ?? null],
  );
  return row.id;
}
