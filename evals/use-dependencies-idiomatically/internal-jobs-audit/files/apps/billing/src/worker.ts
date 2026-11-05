import { createWorker } from "@ledgerly/jobs";
import { db } from "./db";
import { applyPayment } from "./jobs/applyPayment";
import { reconcileBank } from "./jobs/reconcileBank";
import { sendInvoice } from "./jobs/sendInvoice";
import { syncLedger } from "./jobs/syncLedger";
import { voidInvoice } from "./jobs/voidInvoice";

const worker = createWorker({
  db,
  jobs: [sendInvoice, applyPayment, voidInvoice, syncLedger, reconcileBank],
  processes: 4,
  concurrency: 8,
});

worker.start();

process.on("SIGTERM", () => {
  void worker.stop().then(() => process.exit(0));
});
