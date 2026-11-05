import { createServer } from "node:http";
import { createInvoice, requestVoid, type CreateInvoiceInput } from "./routes/invoices";
import { recordPayment, type RecordPaymentInput } from "./routes/payments";

async function readJson<T>(request: AsyncIterable<Buffer>): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    let result: unknown;
    if (request.method === "POST" && url.pathname === "/invoices") {
      result = await createInvoice(await readJson<CreateInvoiceInput>(request));
    } else if (request.method === "POST" && url.pathname.match(/^\/invoices\/[^/]+\/void$/)) {
      await requestVoid(url.pathname.split("/")[2]);
      result = { ok: true };
    } else if (request.method === "POST" && url.pathname === "/payments") {
      result = await recordPayment(await readJson<RecordPaymentInput>(request));
    } else {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
});

server.listen(Number(process.env.PORT ?? 3000));
