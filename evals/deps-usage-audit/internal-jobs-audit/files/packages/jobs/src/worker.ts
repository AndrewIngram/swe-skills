import cluster from "node:cluster";
import type { Db } from "@ledgerly/db";
import { createContext } from "./context";
import type { JobDefinition } from "./define";

export interface WorkerOptions {
  db: Db;
  jobs: JobDefinition<any>[];
  /** Worker processes to fork. Defaults to 1. */
  processes?: number;
  /** Attempts each process runs at once. Defaults to 1. */
  concurrency?: number;
  /** Defaults to 30 seconds. */
  leaseMs?: number;
  /** Defaults to 100 ms. */
  pollMs?: number;
}

export interface Worker {
  start(): void;
  stop(): Promise<void>;
}

const DEFAULT_RETRIES = 5;

interface JobRow {
  id: string;
  name: string;
  payload: unknown;
  attempt: number;
}

export function createWorker(options: WorkerOptions): Worker {
  const { db, processes = 1, concurrency = 1, leaseMs = 30_000, pollMs = 100 } = options;
  const definitions = new Map(options.jobs.map((job) => [job.name, job]));
  const loops: Promise<void>[] = [];
  let running = false;

  async function lease(): Promise<JobRow | undefined> {
    const [job] = await db.query<JobRow>(
      `update jobs
       set leased_until = now() + $2 * interval '1 millisecond', attempt = attempt + 1
       where id = (
         select j.id from jobs j
         where j.completed_at is null and j.failed_at is null
           and j.run_at <= now()
           and (j.leased_until is null or j.leased_until < now())
           and j.name = any($1)
           and (j.concurrency_key is null or not exists (
             select 1 from jobs e
             where e.concurrency_key = j.concurrency_key
               and e.completed_at is null and e.failed_at is null
               and e.id < j.id
           ))
         order by j.run_at, j.id
         limit 1
         for update skip locked
       )
       returning id, name, payload, attempt`,
      [[...definitions.keys()], leaseMs],
    );
    return job;
  }

  async function runNext(): Promise<boolean> {
    const job = await lease();
    if (!job) return false;
    const definition = definitions.get(job.name)!;

    try {
      await db.transaction(async (tx) => {
        const ctx = createContext(db, tx, { id: job.id, attempt: job.attempt, leaseMs });
        await definition.handler(job.payload, ctx);
        await tx.query("update jobs set completed_at = now() where id = $1", [job.id]);
      });
    } catch (error) {
      if (job.attempt > (definition.retries ?? DEFAULT_RETRIES)) {
        await db.query(
          "update jobs set failed_at = now(), last_error = $2, leased_until = null where id = $1",
          [job.id, String(error)],
        );
      } else {
        await db.query(
          `update jobs
           set run_at = now() + $3 * interval '1 second', last_error = $2, leased_until = null
           where id = $1`,
          [job.id, String(error), 2 ** job.attempt],
        );
      }
    }
    return true;
  }

  async function loop() {
    while (running) {
      const ranOne = await runNext().catch(() => false);
      if (!ranOne) await new Promise((resolve) => setTimeout(resolve, pollMs));
    }
  }

  return {
    start() {
      if (processes > 1 && cluster.isPrimary) {
        for (let i = 0; i < processes; i++) cluster.fork();
        return;
      }
      running = true;
      for (let i = 0; i < concurrency; i++) loops.push(loop());
    },

    async stop() {
      running = false;
      await Promise.all(loops);
    },
  };
}
