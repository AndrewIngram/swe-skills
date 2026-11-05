import pg from "pg";

export interface Queryable {
  query<Row = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<Row[]>;
}

export interface Transaction extends Queryable {}

export interface Db extends Queryable {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
}

export function connect(connectionString: string): Db {
  const pool = new pg.Pool({ connectionString });

  return {
    async query(sql, params = []) {
      const result = await pool.query(sql, [...params]);
      return result.rows;
    },

    async transaction(fn) {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const tx: Transaction = {
          async query(sql, params = []) {
            const result = await client.query(sql, [...params]);
            return result.rows;
          },
        };
        const value = await fn(tx);
        await client.query("commit");
        return value;
      } catch (error) {
        await client.query("rollback");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
