import { defineJob } from "@ledgerly/jobs";
import { sendEmail } from "../lib/email";
import { jobs } from "./client";
import { syncLedger } from "./syncLedger";

export type ApplyPaymentPayload = { paymentId: string };

export const applyPayment = defineJob<ApplyPaymentPayload>({
  name: "apply-payment",
  async handler({ paymentId }, ctx) {
    const [payment] = await ctx.tx.query<{
      invoice_id: string;
      invoice_number: string;
      account_id: string;
      amount_cents: number;
      payer_email: string;
      owner_email: string;
    }>(
      `select p.invoice_id, i.number as invoice_number, i.account_id, p.amount_cents, p.payer_email, a.owner_email
       from payments p
       join invoices i on i.id = p.invoice_id
       join accounts a on a.id = i.account_id
       where p.id = $1`,
      [paymentId],
    );
    if (!payment) throw new Error(`Payment ${paymentId} not found`);

    await ctx.tx.query("update invoices set paid_cents = paid_cents + $2 where id = $1", [
      payment.invoice_id,
      payment.amount_cents,
    ]);
    await ctx.tx.query(
      "insert into ledger_entries (account_id, invoice_id, payment_id, amount_cents) values ($1, $2, $3, $4)",
      [payment.account_id, payment.invoice_id, paymentId, -payment.amount_cents],
    );
    await jobs.enqueue(syncLedger, { accountId: payment.account_id });

    const data = { invoiceNumber: payment.invoice_number, amountCents: payment.amount_cents };
    await sendEmail(ctx, { to: payment.payer_email, template: "payment-receipt", data });
    await sendEmail(ctx, { to: payment.owner_email, template: "payment-received", data });
  },
});
