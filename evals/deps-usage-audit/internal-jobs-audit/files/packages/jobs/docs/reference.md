# API reference

## `defineJob<Payload>(definition)`

| Option | Type | Default | |
| --- | --- | --- | --- |
| `name` | `string` | | Unique; stored on each job row. |
| `handler` | `(payload, ctx) => Promise<void>` | | See [`JobContext`](#jobcontext). |
| `concurrencyKey` | `(payload) => string` | | See [ordering](concepts/concurrency.md#ordering). |
| `retries` | `number` | `5` | Retries after the first attempt. |

Payloads are stored as JSON, so use JSON-safe types.

## `createClient(db)`

Returns a `JobsClient`.

### `jobs.enqueue(job, payload, options?)`

| Option | Type | |
| --- | --- | --- |
| `tx` | `Transaction` | Write the job in this transaction. See [transactions](concepts/transactions.md#enqueuing-from-a-request). |
| `runAt` | `Date` | Earliest time the job may run. Defaults to now. |

Resolves to the job's id.

## `JobContext`

| Member | |
| --- | --- |
| `jobId` | The job's id. |
| `attempt` | `1` on the first attempt. |
| `tx` | The attempt's transaction. |
| `once(key, fn)` | Runs a step and records its result. See [steps](concepts/lifecycle.md#steps-ctxoncekey-fn). |
| `enqueue(job, payload, options?)` | Enqueues a job in the attempt's transaction. Takes `runAt`. |
| `heartbeat()` | Extends the attempt's lease. See [leases](concepts/lifecycle.md#leases). |

## `createWorker(options)`

| Option | Type | Default | |
| --- | --- | --- | --- |
| `db` | `Db` | | |
| `jobs` | `JobDefinition[]` | | The jobs this worker runs. |
| `processes` | `number` | `1` | Worker processes to fork. |
| `concurrency` | `number` | `1` | Attempts each process runs at once. |
| `leaseMs` | `number` | `30000` | |
| `pollMs` | `number` | `100` | |

`worker.start()` begins polling; `worker.stop()` resolves when running attempts finish.
