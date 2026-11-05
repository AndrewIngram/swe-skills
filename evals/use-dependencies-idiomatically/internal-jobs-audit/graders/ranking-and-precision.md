---
type: llm
weight: 1
---

Four problems are planted: the enqueue without `tx` in `createInvoice`, the `jobs` client used inside `applyPayment`, the shared `once` key in `sendEmail`, and the in-process lock in `syncLedger`. Three conditions, all required for PASS:
1. Whichever of those four the reply finds are presented as the most serious findings, ahead of style, convention or underuse suggestions.
2. If the reply discusses `reconcileBank` running past its lease without `ctx.heartbeat()`, it ranks that below those findings and makes it conditional on how long the job actually runs (for example asking, or saying it depends on transaction volume). Not mentioning it at all is fine.
3. The reply does not describe these as misuses: the `{ tx }` enqueue in `recordPayment` (`routes/payments.ts`), the `ctx.enqueue` in `voidInvoice`, or the enqueue in `requestVoid`, which has no surrounding transaction.
If the reply finds none of the four problems, FAIL.
