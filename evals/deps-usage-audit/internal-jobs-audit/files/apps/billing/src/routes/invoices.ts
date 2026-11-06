import { db } from "../db";
import { jobs } from "../jobs/client";
import { sendInvoice } from "../jobs/sendInvoice";
import { voidInvoice } from "../jobs/voidInvoice";

export type CreateInvoiceInput = {
  accountId: string;
  customerEmail: string;
  lines: { description: string; amountCents: number }[];
};

export async function createInvoice(input: CreateInvoiceInput) {
  return db.transaction(async (tx) => {
    const totalCents = input.lines.reduce((sum, line) => sum + line.amountCents, 0);
    const [invoice] = await tx.query<{ id: string; number: string }>(
      `insert into invoices (account_id, customer_email, number, total_cents)
       values ($1, $2, next_invoice_number($1), $3)
       returning id, number`,
      [input.accountId, input.customerEmail, totalCents],
    );
    for (const line of input.lines) {
      await tx.query("insert into invoice_lines (invoice_id, description, amount_cents) values ($1, $2, $3)", [
        invoice.id,
        line.description,
        line.amountCents,
      ]);
    }
    await tx.query("insert into ledger_entries (account_id, invoice_id, amount_cents) values ($1, $2, $3)", [
      input.accountId,
      invoice.id,
      totalCents,
    ]);
    await jobs.enqueue(sendInvoice, { invoiceId: invoice.id });
    return invoice;
  });
}

export async function requestVoid(invoiceId: string) {
  await jobs.enqueue(voidInvoice, { invoiceId });
}
