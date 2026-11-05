import { defineJob } from "@ledgerly/jobs";
import { sendEmail } from "../lib/email";

export type SendInvoicePayload = { invoiceId: string };

export const sendInvoice = defineJob<SendInvoicePayload>({
  name: "send-invoice",
  async handler({ invoiceId }, ctx) {
    const [invoice] = await ctx.tx.query<{ customer_email: string; number: string; total_cents: number }>(
      "select customer_email, number, total_cents from invoices where id = $1",
      [invoiceId],
    );
    if (!invoice) throw new Error(`Invoice ${invoiceId} not found`);

    await sendEmail(ctx, {
      to: invoice.customer_email,
      template: "invoice",
      data: { number: invoice.number, totalCents: invoice.total_cents },
    });
    await ctx.tx.query("update invoices set sent_at = now() where id = $1", [invoiceId]);
  },
});
