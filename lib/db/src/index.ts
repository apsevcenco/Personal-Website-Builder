import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dns from "dns";
import * as schema from "./schema";

// Prefer IPv4 globally. Some hosts (e.g. Render Free) don't have outbound
// IPv6, but Supabase/AWS often resolve AAAA first.
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function isLocalHost(host: string): boolean {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    !host.includes(".") || // single-word hostnames (e.g. Replit's "helium")
    host.endsWith(".internal") ||
    host.endsWith(".replit.dev") ||
    host.startsWith("10.") ||
    host.startsWith("172.") ||
    host.startsWith("192.168.")
  );
}

function isIp(host: string): boolean {
  return /^[0-9.]+$/.test(host) || host.includes(":");
}

function shouldForceSsl(host: string, urlParams: URLSearchParams): boolean {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  // Honour `sslmode` from URL if provided
  const sslmode = urlParams.get("sslmode");
  if (sslmode === "disable") return false;
  if (sslmode && sslmode !== "disable") return true;
  // Default: SSL for non-local hosts only
  return !isLocalHost(host);
}

// Build pool config. We parse the URL ourselves (instead of passing
// `connectionString` to pg) because pg's internal parser overrides any
// `host` we set when both are present. We resolve the hostname to an IPv4
// address ONCE at startup so pg connects directly to the IP, bypassing any
// IPv6 resolution path (Render Free has no outbound IPv6, but Supabase
// resolves AAAA first).
async function buildPoolConfig(connectionString: string): Promise<pg.PoolConfig> {
  const url = new URL(connectionString);
  const originalHost = decodeURIComponent(url.hostname);
  const port = url.port ? Number(url.port) : 5432;
  const user = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const database = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const params = url.searchParams;

  let host = originalHost;
  if (!isIp(originalHost) && !isLocalHost(originalHost)) {
    try {
      const { address } = await dns.promises.lookup(originalHost, { family: 4 });
      host = address;
    } catch {
      // fall back to hostname; pg will try its own resolution
    }
  }

  const config: pg.PoolConfig = {
    host,
    port,
    user,
    password,
    database,
  };

  if (shouldForceSsl(originalHost, params)) {
    config.ssl = { rejectUnauthorized: false, servername: originalHost };
  }

  return config;
}

const config = await buildPoolConfig(process.env.DATABASE_URL);
export const pool = new Pool(config);
export const db = drizzle(pool, { schema });

export * from "./schema";
