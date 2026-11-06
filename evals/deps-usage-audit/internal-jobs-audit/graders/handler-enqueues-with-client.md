---
type: llm
weight: 2
---

The reply flags `apps/billing/src/jobs/applyPayment.ts`: inside a handler it enqueues `syncLedger` with the app's `jobs` client instead of `ctx.enqueue`. It explains at least one consequence of the child job being written outside the attempt's transaction: the sync can run before the new ledger entry is committed and so miss it, the child survives a failed attempt, or each retry enqueues it again. It recommends `ctx.enqueue`. PASS only if `applyPayment` is named and the problem is tied to the attempt's transaction.
