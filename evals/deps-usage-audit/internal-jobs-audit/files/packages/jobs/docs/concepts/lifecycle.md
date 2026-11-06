# The job lifecycle

A job is a row in the `jobs` table. A worker leases it, runs its handler, and marks it complete in the same transaction as the handler's writes.

## Attempts

1. **Enqueued.** The row is written with a `run_at` time.
2. **Leased.** A worker process claims the job for `leaseMs` (30 seconds by default).
3. **Attempt.** The handler runs inside a transaction, `ctx.tx`.
4. **Finished.** When the handler returns, the transaction commits and the job is marked complete with it. When the handler throws, the transaction rolls back and the job is retried with exponential backoff, up to `retries` times (5 by default), and then marked failed.

## Delivery is at least once

An attempt can run again after its handler has already done its work: the worker crashes before the commit, the connection drops, or the lease expires. Design every handler so that running it again is safe.

- **Database writes through `ctx.tx` are covered.** They commit together with the job's completion, or not at all, so they happen exactly once.
- **Everything else is not.** Writes through any other connection, and every side effect outside the database (emails, calls to other services, uploads), happen once per attempt. Wrap each one in `ctx.once`.

## Steps: `ctx.once(key, fn)`

`ctx.once` runs `fn` and records its result in the job's step log under `key`. On a later attempt of the same job, a call with the same key returns the recorded result without running `fn`. The step log is written outside the attempt's transaction, so a step that ran stays recorded when the attempt fails.

The key names the step within its job, so give each step a handler takes its own key. Two calls with the same key in one job are the same step: the second returns the first one's result, and its `fn` never runs. A helper that calls `ctx.once` for its caller should take the key, or part of it, from the caller.

Keep keys the same from one attempt to the next. A key built from a timestamp or a random id is a new step on every attempt, so the step runs again.

## Leases

A lease lasts `leaseMs`. If an attempt is still running when its lease expires, the job is leased again and a second attempt starts while the first is still going. A handler that can run longer than the lease should call `ctx.heartbeat()` between batches or pages, which extends the lease from that moment.
