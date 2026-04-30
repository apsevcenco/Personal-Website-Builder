import crypto from "crypto";

const RAW_SECRET = process.env["SESSION_SECRET"];
if (!RAW_SECRET || RAW_SECRET.length < 16) {
  throw new Error(
    "SESSION_SECRET environment variable must be set to a strong random value (>= 16 characters). Refusing to start with an insecure default.",
  );
}
const SECRET: string = RAW_SECRET;
const COOKIE_NAME = "vc_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 7;

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createAdminToken(): string {
  const expires = Date.now() + TTL_MS;
  const payload = `admin:${expires}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const [scope, expiresStr] = payload.split(":");
  if (scope !== "admin") return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_TTL_MS = TTL_MS;
