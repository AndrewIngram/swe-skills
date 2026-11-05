# @ledgerly/jobs

Background jobs for Ledgerly services, stored in Postgres beside the data they act on.

```ts
import { createClient, defineJob } from "@ledgerly/jobs";

export const welcomeEmail = defineJob<{ userId: string }>({
  name: "welcome-email",
  async handler({ userId }, ctx) {
    const [user] = await ctx.tx.query<{ email: string }>("select email from users where id = $1", [userId]);
    await ctx.once("send", () => mailer.send({ to: user.email, template: "welcome", data: {} }));
  },
});

const jobs = createClient(db);
await db.transaction(async (tx) => {
  const [user] = await tx.query<{ id: string }>("insert into users (email) values ($1) returning id", [email]);
  await jobs.enqueue(welcomeEmail, { userId: user.id }, { tx });
});
```

Read the concepts before writing a handler. They cover what the package guarantees and what your handler has to do for those guarantees to hold:

- [The job lifecycle](docs/concepts/lifecycle.md): attempts, at-least-once delivery, steps and leases.
- [Transactions](docs/concepts/transactions.md): enqueuing from a request and from a job.
- [Ordering and concurrency](docs/concepts/concurrency.md): how workers run, and the one ordering guarantee.

The [API reference](docs/reference.md) lists every function and option.

Apply `migrations/` to each database that runs jobs.
