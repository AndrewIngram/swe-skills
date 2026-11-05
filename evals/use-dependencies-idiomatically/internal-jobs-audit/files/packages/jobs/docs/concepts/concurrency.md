# Ordering and concurrency

## How workers run

`createWorker` forks `processes` worker processes, and each runs up to `concurrency` attempts at once. Production runs the worker on several machines as well. Process memory is not shared between any of these: a `Map`, lock or cache in module scope belongs to one process, so it neither serializes nor deduplicates work across workers.

## Ordering

Jobs without a concurrency key run in any order, and jobs enqueued one after another can run at the same time.

To run one job at a time per key, set `concurrencyKey` on the definition:

```ts
export const syncCustomer = defineJob<{ customerId: string }>({
  name: "sync-customer",
  concurrencyKey: ({ customerId }) => customerId,
  async handler({ customerId }, ctx) {
    // ...
  },
});
```

Jobs with the same key never run at the same time, across all processes and machines, and they start in the order they were enqueued: a job waits until every earlier job with its key has completed or failed. This is the only ordering guarantee the package makes.
