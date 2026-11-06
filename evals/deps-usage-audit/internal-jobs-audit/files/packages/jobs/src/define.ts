import type { JobContext } from "./context";

export interface JobDefinition<Payload> {
  /** Unique name, stored on each job row. */
  readonly name: string;
  readonly handler: (payload: Payload, ctx: JobContext) => Promise<void>;
  /** Jobs that return the same key run one at a time, in enqueue order. */
  readonly concurrencyKey?: (payload: Payload) => string;
  /** Retries after the first attempt. Defaults to 5. */
  readonly retries?: number;
}

export function defineJob<Payload>(definition: JobDefinition<Payload>): JobDefinition<Payload> {
  return definition;
}
