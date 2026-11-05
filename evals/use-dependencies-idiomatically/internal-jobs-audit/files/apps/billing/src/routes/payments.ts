import { db } from "../db";
import { applyPayment } from "../jobs/applyPayment";
import { jobs } from "../jobs/client";

export type RecordPaymentInput = {
  invoiceId: string;
  amountCents: number;
  payerEmail: string;
  providerRef: string;
};

export async function recordPayment(input: RecordPaymentInput) {
  return db.transaction(async (tx) => {
    const [payment] = await tx.query<{ id: string }>(
      `insert into payments (invoice_id, amount_cents, payer_email, provider_ref)
       values ($1, $2, $3, $4)
       returning id`,
      [input.invoiceId, input.amountCents, input.payerEmail, input.providerRef],
    );
    await jobs.enqueue(applyPayment, { paymentId: payment.id }, { tx });
    return payment;
  });
}
