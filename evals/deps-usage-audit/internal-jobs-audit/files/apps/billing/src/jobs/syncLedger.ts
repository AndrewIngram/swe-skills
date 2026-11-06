import { defineJob, type JobContext } from "@ledgerly/jobs";
import { ledgerApi, type LedgerEntry } from "../lib/ledgerApi";

export type SyncLedgerPayload = { accountId: string };

// The ledger rejects entries posted out of order, so syncs for one account must not overlap.
const inFlight = new Map<string, Promise<void>>();

export const syncLedger = defineJob<SyncLedgerPayload>({
  name: "sync-ledger",
  async handler({ accountId }, ctx) {
    const previous = inFlight.get(accountId) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(() => postUnsynced(accountId, ctx));
    inFlight.set(accountId, current);
    try {
      await current;
    } finally {
      if (inFlight.get(accountId) === current) inFlight.delete(accountId);
    }
  },
});

async function postUnsynced(accountId: string, ctx: JobContext) {
  const entries = await ctx.tx.query<LedgerEntry>(
    `select id, invoice_id, payment_id, amount_cents, created_at
     from ledger_entries
     where account_id = $1 and synced_at is null
     order by id`,
    [accountId],
  );
  if (entries.length === 0) return;

  await ctx.once("post-entries", () => ledgerApi.postEntries(accountId, entries));
  await ctx.tx.query("update ledger_entries set synced_at = now() where id = any($1)", [
    entries.map((entry) => entry.id),
  ]);
}
