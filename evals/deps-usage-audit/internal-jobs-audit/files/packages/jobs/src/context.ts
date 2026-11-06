import type { Db, Transaction } from "@ledgerly/db";
import { insertJob, type EnqueueOptions } from "./client";
import type { JobDefinition } from "./define";

export interface JobContext {
  readonly jobId: string;
  /** 1 on the first attempt. */
  readonly attempt: number;
  /** The attempt's transaction. */
  readonly tx: Transaction;
  /** Runs a step and records its result. */
  once<T>(key: string, step: () => Promise<T>): Promise<T>;
  /** Enqueues a job from inside this one. */
  enqueue<Payload>(job: JobDefinition<Payload>, payload: Payload, options?: Omit<EnqueueOptions, "tx">): Promise<string>;
  /** Extends the attempt's lease. */
  heartbeat(): Promise<void>;
}

interface LeasedJob {
  id: string;
  attempt: number;
  leaseMs: number;
}

export function createContext(db: Db, tx: Transaction, job: LeasedJob): JobContext {
  return {
    jobId: job.id,
    attempt: job.attempt,
    tx,

    async once(key, step) {
      const [recorded] = await db.query<{ result: unknown }>(
        "select result from job_steps where job_id = $1 and key = $2",
        [job.id, key],
      );
      if (recorded) return recorded.result as Awaited<ReturnType<typeof step>>;

      const result = await step();
      // On db, not tx: a step that ran stays recorded when the attempt rolls back.
      await db.query("insert into job_steps (job_id, key, result) values ($1, $2, $3)", [
        job.id,
        key,
        JSON.stringify(result ?? null),
      ]);
      return result;
    },

    enqueue(definition, payload, options = {}) {
      return insertJob(tx, definition, payload, options.runAt);
    },

    async heartbeat() {
      await db.query(
        "update jobs set leased_until = now() + $2 * interval '1 millisecond' where id = $1",
        [job.id, job.leaseMs],
      );
    },
  };
}
