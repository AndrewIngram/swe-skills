---
type: llm
weight: 2
---

The reply flags `createInvoice` in `apps/billing/src/routes/invoices.ts`: it calls `jobs.enqueue(sendInvoice, ...)` inside `db.transaction` without passing `{ tx }`, so the job is committed on its own connection before the invoice is. It explains a consequence: a worker can run the job before the invoice is visible (so it fails and retries), or the job survives when the transaction rolls back. It recommends passing `{ tx }`. PASS only if `createInvoice` (or the enqueue in `invoices.ts`) is named and the problem is described as the job not being part of the surrounding transaction.
