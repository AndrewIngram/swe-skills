---
type: llm
weight: 2
---

The reply flags the module-level `inFlight` map in `apps/billing/src/jobs/syncLedger.ts`: it only serializes syncs within one process, while the worker runs several processes (`processes: 4` in `apps/billing/src/worker.ts`) and possibly several machines, so two syncs for the same account can still overlap and post out of order. It recommends the package's `concurrencyKey` option, keyed by `accountId`. PASS only if the reply names this map or lock, says why it fails across processes, and recommends `concurrencyKey`.
