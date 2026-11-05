export interface LedgerEntry {
  id: string;
  invoice_id: string;
  payment_id: string | null;
  amount_cents: number;
  created_at: string;
}

const baseUrl = process.env.LEDGER_API_URL ?? "https://ledger.internal";

export const ledgerApi = {
  /** The ledger rejects an entry older than the last one it accepted for the account. */
  async postEntries(accountId: string, entries: LedgerEntry[]): Promise<{ batchId: string }> {
    const response = await fetch(`${baseUrl}/accounts/${accountId}/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    if (!response.ok) throw new Error(`Ledger responded ${response.status}`);
    const body: { batchId: string } = await response.json();
    return body;
  },
};
