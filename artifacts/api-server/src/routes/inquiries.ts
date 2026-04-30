import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db, inquiriesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
});

router.post("/inquiries", async (req: Request, res: Response) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please fill out name, valid email, and message." });
    return;
  }
  try {
    await db.insert(inquiriesTable).values(parsed.data);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save inquiry");
    res.status(500).json({ error: "Failed to send inquiry" });
  }
});

router.get("/inquiries", requireAdmin, async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(inquiriesTable)
    .orderBy(desc(inquiriesTable.createdAt))
    .limit(200);
  res.json({ inquiries: rows });
});

router.post("/inquiries/:id/read", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.update(inquiriesTable).set({ read: true }).where(eq(inquiriesTable.id, id));
  res.json({ ok: true });
});

router.delete("/inquiries/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id));
  res.json({ ok: true });
});

export default router;
