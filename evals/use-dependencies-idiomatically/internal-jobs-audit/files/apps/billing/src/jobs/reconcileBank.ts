import { defineJob } from "@ledgerly/jobs";
import { bankApi } from "../lib/bankApi";

export type ReconcileBankPayload = { date: string };

/** Pulls the previous day's bank transactions so they can be matched to payments. Enqueued nightly by cron. */
export const reconcileBank = defineJob<ReconcileBankPayload>({
  name: "reconcile-bank",
  async handler({ date }, ctx) {
    let cursor: string | undefined;
    do {
      const page = await bankApi.listTransactions({ date, cursor });
      for (const transaction of page.transactions) {
        await ctx.tx.query(
          `insert into bank_transactions (id, account_ref, amount_cents, booked_on)
           values ($1, $2, $3, $4)
           on conflict (id) do nothing`,
          [transaction.id, transaction.accountRef, transaction.amountCents, transaction.bookedOn],
        );
      }
      cursor = page.nextCursor;
    } while (cursor);

    await ctx.tx.query("update reconciliation_days set fetched_at = now() where day = $1", [date]);
  },
});
