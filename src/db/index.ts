import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle({ client: pool, schema, casing: "snake_case" });

export type DbClient = typeof db;
export type DbTransaction = Parameters<
  Parameters<DbClient["transaction"]>[0]
>[0];
