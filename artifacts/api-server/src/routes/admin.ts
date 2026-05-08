import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_TTL_MS,
  createAdminToken,
  verifyAdminToken,
} from "../lib/adminSession";

const router: IRouter = Router();

const loginSchema = z.object({ password: z.string().min(1) });

function timingSafeStringEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

router.post("/admin/login", (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password is required" });
    return;
  }
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) {
    req.log.error("ADMIN_PASSWORD env var is not set");
    res.status(500).json({ error: "Admin password is not configured on the server." });
    return;
  }
  if (!timingSafeStringEqual(parsed.data.password, expected)) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  const token = createAdminToken();
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  const crossSite = process.env["CROSS_SITE_COOKIES"] === "true";
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: crossSite ? "none" : "lax",
    secure: crossSite ? true : isHttps,
    maxAge: ADMIN_TTL_MS,
    path: "/",
  });
  res.json({ ok: true });
});

router.post("/admin/logout", (_req: Request, res: Response) => {
  const crossSite = process.env["CROSS_SITE_COOKIES"] === "true";
  res.clearCookie(ADMIN_COOKIE_NAME, {
    path: "/",
    sameSite: crossSite ? "none" : "lax",
    secure: crossSite ? true : undefined,
  });
  res.json({ ok: true });
});

router.get("/admin/me", (req: Request, res: Response) => {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[ADMIN_COOKIE_NAME];
  res.json({ authenticated: verifyAdminToken(token) });
});

export default router;
