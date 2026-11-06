import { connect } from "@ledgerly/db";

export const db = connect(process.env.DATABASE_URL ?? "postgres://localhost/ledgerly");
