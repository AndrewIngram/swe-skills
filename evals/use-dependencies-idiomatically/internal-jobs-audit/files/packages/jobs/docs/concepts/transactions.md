# Transactions

Jobs live in the application database so that enqueuing a job can be part of the transaction that writes the data the job acts on.

## Enqueuing from a request

Pass the transaction:

```ts
await db.transaction(async (tx) => {
  const [order] = await tx.query<{ id: string }>("insert into orders ... returning id", [...]);
  await jobs.enqueue(fulfilOrder, { orderId: order.id }, { tx });
});
```

The job row is written in your transaction. Workers see it only after you commit, and it disappears if you roll back.

Without `tx`, `enqueue` writes on its own connection and commits at once. Inside a transaction, that lets a worker lease the job before your transaction commits: the handler can't see your rows yet, so it fails and is retried, and if your transaction rolls back, the job runs for data that never existed. Leave out `tx` only when no transaction surrounds the call.

## Enqueuing from a job

Use `ctx.enqueue`:

```ts
async handler({ orderId }, ctx) {
  await ctx.tx.query("update orders set shipped_at = now() where id = $1", [orderId]);
  await ctx.enqueue(notifyCustomer, { orderId });
}
```

`ctx.enqueue` writes the child job in the attempt's transaction. So:

- The child becomes visible when the attempt commits, after the parent's writes.
- If the attempt fails, the child is rolled back with it.
- A retried attempt enqueues the child once, not once per attempt.

The `jobs` client gives none of these inside a handler. It writes on its own connection, so the child can run before the parent's writes are visible, it survives a failed attempt, and every retry enqueues it again.

## Reading and writing in a handler

Use `ctx.tx`. A query through the application's `db` runs outside the attempt: it can't see the attempt's uncommitted writes, and it isn't rolled back with it.
