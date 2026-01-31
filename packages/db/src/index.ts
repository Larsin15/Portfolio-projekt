import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export * from "./schema";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://portfolio:portfolio_dev_password@localhost:5432/portfolio",
});

export const db = drizzle(pool, { schema });
export type Database = typeof db;

