import type { JobContext } from "@ledgerly/jobs";
import { mailer, type EmailMessage } from "./mailer";

/** Sends an email from a job, once per job even when the job is retried. */
export function sendEmail(ctx: JobContext, message: EmailMessage) {
  return ctx.once("send-email", () => mailer.send(message));
}
