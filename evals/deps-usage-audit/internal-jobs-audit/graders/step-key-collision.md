---
type: llm
weight: 2
---

The reply flags that `sendEmail` in `apps/billing/src/lib/email.ts` always calls `ctx.once` with the same key, `"send-email"`, and that `applyPayment` calls it twice in one job, so the second email (the `payment-received` email to the account owner) never sends: the second `once` call returns the first one's recorded result. It recommends a distinct key per step, for example taking the key from the caller. PASS only if the reply identifies that the second email in `applyPayment` is skipped because of the shared key.
