import { createClient } from "@ledgerly/jobs";
import { db } from "../db";

export const jobs = createClient(db);
