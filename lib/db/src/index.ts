import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dns from "dns";
import * as schema from "./schema";

// Prefer IPv4 DNS resolution. Some hosts (e.g. Render Free) don't have
// outbound IPv6, but Supabase/AWS often resolve to AAAA first.
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function shouldUseSsl(connectionString: string): boolean {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  // Auto-enable SSL for non-local hosts (Supabase, Neon, Render, etc.)
  try {
    const url = new URL(connectionString);
    const host = url.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".internal")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSsl(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
