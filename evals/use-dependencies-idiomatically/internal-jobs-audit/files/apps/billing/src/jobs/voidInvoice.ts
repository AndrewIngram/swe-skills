import { defineJob } from "@ledgerly/jobs";
import { syncLedger } from "./syncLedger";

export type VoidInvoicePayload = { invoiceId: string };

export const voidInvoice = defineJob<VoidInvoicePayload>({
  name: "void-invoice",
  async handler({ invoiceId }, ctx) {
    const [invoice] = await ctx.tx.query<{ account_id: string; total_cents: number }>(
      "update invoices set voided_at = now() where id = $1 and voided_at is null returning account_id, total_cents",
      [invoiceId],
    );
    if (!invoice) return;

    await ctx.tx.query("insert into ledger_entries (account_id, invoice_id, amount_cents) values ($1, $2, $3)", [
      invoice.account_id,
      invoiceId,
      -invoice.total_cents,
    ]);
    await ctx.enqueue(syncLedger, { accountId: invoice.account_id });
  },
});
