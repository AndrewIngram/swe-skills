# Ledgerly

Invoicing and payments for small businesses.

- `apps/billing`: the billing API (`src/server.ts`) and its background worker (`src/worker.ts`).
- `packages/db`: the Postgres client shared by every service.
- `packages/jobs`: background jobs, stored in Postgres. See its [README](packages/jobs/README.md).

Run `npm install`, then `npm run typecheck`.
