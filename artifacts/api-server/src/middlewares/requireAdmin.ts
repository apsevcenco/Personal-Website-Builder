import type { Request, Response, NextFunction } from "express";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "../lib/adminSession";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[ADMIN_COOKIE_NAME];
  if (verifyAdminToken(token)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}
