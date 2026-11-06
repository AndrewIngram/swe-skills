export interface BankTransaction {
  id: string;
  accountRef: string;
  amountCents: number;
  bookedOn: string;
}

export interface TransactionPage {
  transactions: BankTransaction[];
  nextCursor?: string;
}

export const bankApi = {
  async listTransactions(params: { date: string; cursor?: string }): Promise<TransactionPage> {
    const query = new URLSearchParams({ date: params.date, ...(params.cursor ? { cursor: params.cursor } : {}) });
    const response = await fetch(`${process.env.BANK_API_URL}/transactions?${query}`, {
      headers: { authorization: `Bearer ${process.env.BANK_API_TOKEN}` },
    });
    if (!response.ok) throw new Error(`Bank responded ${response.status}`);
    const body: TransactionPage = await response.json();
    return body;
  },
};
