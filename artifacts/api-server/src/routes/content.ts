import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, siteContentTable } from "@workspace/db";
import { siteContentSchema, type SiteContent } from "../lib/contentSchema";
import { defaultSiteContent } from "../lib/contentDefaults";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

let cachedSingletonId: number | null = null;

async function ensureSingletonRow(): Promise<number> {
  if (cachedSingletonId !== null) return cachedSingletonId;
  const rows = await db
    .select({ id: siteContentTable.id })
    .from(siteContentTable)
    .orderBy(desc(siteContentTable.id))
    .limit(1);
  if (rows.length > 0) {
    cachedSingletonId = rows[0].id;
    return cachedSingletonId;
  }
  const [inserted] = await db
    .insert(siteContentTable)
    .values({ data: defaultSiteContent })
    .returning({ id: siteContentTable.id });
  cachedSingletonId = inserted.id;
  return cachedSingletonId;
}

async function loadContent(): Promise<SiteContent> {
  const id = await ensureSingletonRow();
  const rows = await db
    .select()
    .from(siteContentTable)
    .where(eq(siteContentTable.id, id))
    .limit(1);
  if (rows.length === 0) return defaultSiteContent;
  const parsed = siteContentSchema.safeParse(rows[0].data);
  if (!parsed.success) {
    return { ...defaultSiteContent, ...(rows[0].data as object) } as SiteContent;
  }
  return parsed.data;
}

router.get("/content", async (req: Request, res: Response) => {
  try {
    const content = await loadContent();
    res.set("Cache-Control", "no-store");
    res.json(content);
  } catch (err) {
    req.log.error({ err }, "Failed to load content");
    res.status(500).json({ error: "Failed to load content" });
  }
});

router.put("/content", requireAdmin, async (req: Request, res: Response) => {
  const parsed = siteContentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid content payload", issues: parsed.error.issues });
    return;
  }
  try {
    const id = await ensureSingletonRow();
    await db
      .update(siteContentTable)
      .set({ data: parsed.data, updatedAt: new Date() })
      .where(eq(siteContentTable.id, id));
    res.json({ ok: true, content: parsed.data });
  } catch (err) {
    req.log.error({ err }, "Failed to save content");
    res.status(500).json({ error: "Failed to save content" });
  }
});

router.post("/content/reset", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = await ensureSingletonRow();
    await db
      .update(siteContentTable)
      .set({ data: defaultSiteContent, updatedAt: new Date() })
      .where(eq(siteContentTable.id, id));
    res.json({ ok: true, content: defaultSiteContent });
  } catch (err) {
    req.log.error({ err }, "Failed to reset content");
    res.status(500).json({ error: "Failed to reset content" });
  }
});

export default router;
