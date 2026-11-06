export interface EmailMessage {
  to: string;
  template: string;
  data: Record<string, string | number>;
}

export const mailer = {
  async send(message: EmailMessage): Promise<{ id: string }> {
    const response = await fetch(`${process.env.MAILER_URL}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.MAILER_TOKEN}` },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error(`Mailer responded ${response.status}`);
    const body: { id: string } = await response.json();
    return body;
  },
};
