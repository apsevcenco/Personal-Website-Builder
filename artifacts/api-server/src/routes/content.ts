import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db, siteContentTable } from "@workspace/db";
import {
  siteContentSchema,
  localizedContentSchema,
  localeSchema,
  SOURCE_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
  type LocalizedContent,
  type SiteContent,
} from "../lib/contentSchema";
import { defaultLocalizedContent, defaultSiteContent } from "../lib/contentDefaults";
import { requireAdmin } from "../middlewares/requireAdmin";
import { translateSiteContent } from "../lib/translator";

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
    .values({ data: defaultLocalizedContent })
    .returning({ id: siteContentTable.id });
  cachedSingletonId = inserted.id;
  return cachedSingletonId;
}

function migrateLegacy(raw: unknown): LocalizedContent {
  // Already localized?
  const localized = localizedContentSchema.safeParse(raw);
  if (localized.success) return localized.data;
  // Legacy: single SiteContent — wrap into all locales
  const legacy = siteContentSchema.safeParse(raw);
  if (legacy.success) {
    return {
      en: legacy.data,
      fr: legacy.data,
      it: legacy.data,
      de: legacy.data,
      es: legacy.data,
    };
  }
  // Partial / unknown — fall back to defaults merged with whatever we can salvage
  if (raw && typeof raw === "object") {
    const candidate = raw as Record<string, unknown>;
    const next: Partial<LocalizedContent> = {};
    for (const loc of SUPPORTED_LOCALES) {
      const single = siteContentSchema.safeParse(candidate[loc]);
      next[loc] = single.success ? single.data : defaultSiteContent;
    }
    return {
      en: next.en ?? defaultSiteContent,
      fr: next.fr ?? defaultSiteContent,
      it: next.it ?? defaultSiteContent,
      de: next.de ?? defaultSiteContent,
      es: next.es ?? defaultSiteContent,
    };
  }
  return defaultLocalizedContent;
}

async function loadAll(): Promise<LocalizedContent> {
  const id = await ensureSingletonRow();
  const rows = await db
    .select()
    .from(siteContentTable)
    .where(eq(siteContentTable.id, id))
    .limit(1);
  if (rows.length === 0) return defaultLocalizedContent;
  return migrateLegacy(rows[0].data);
}

async function saveAll(content: LocalizedContent): Promise<void> {
  const id = await ensureSingletonRow();
  await db
    .update(siteContentTable)
    .set({ data: content, updatedAt: new Date() })
    .where(eq(siteContentTable.id, id));
}

function pickLocale(req: Request): Locale {
  const raw = req.query["lang"];
  const candidate = typeof raw === "string" ? raw : "";
  const parsed = localeSchema.safeParse(candidate);
  return parsed.success ? parsed.data : SOURCE_LOCALE;
}

// ---------- Public ----------

function mergeMediaFromSource(target: SiteContent, source: SiteContent): SiteContent {
  const mergedImages = {
    hero: target.images?.hero || source.images?.hero || "",
    profile: target.images?.profile || source.images?.profile || "",
  };
  const mergedGallery = target.gallery.map((g, i) => ({
    ...g,
    image: g.image || source.gallery[i]?.image || "",
  }));
  return { ...target, images: mergedImages, gallery: mergedGallery };
}

router.get("/content", async (req: Request, res: Response) => {
  try {
    const all = await loadAll();
    const locale = pickLocale(req);
    const base: SiteContent = all[locale] ?? all[SOURCE_LOCALE];
    const single: SiteContent =
      locale === SOURCE_LOCALE ? base : mergeMediaFromSource(base, all[SOURCE_LOCALE]);
    res.set("Cache-Control", "no-store");
    res.json(single);
  } catch (err) {
    req.log.error({ err }, "Failed to load content");
    res.status(500).json({ error: "Failed to load content" });
  }
});

// ---------- Admin: read all locales ----------

router.get("/admin/content", requireAdmin, async (req: Request, res: Response) => {
  try {
    const all = await loadAll();
    res.set("Cache-Control", "no-store");
    res.json({ locales: SUPPORTED_LOCALES, source: SOURCE_LOCALE, content: all });
  } catch (err) {
    req.log.error({ err }, "Failed to load admin content");
    res.status(500).json({ error: "Failed to load content" });
  }
});

// ---------- Admin: save a single locale ----------

const putBodySchema = z.object({
  locale: localeSchema,
  content: siteContentSchema,
});

router.put("/admin/content", requireAdmin, async (req: Request, res: Response) => {
  const parsed = putBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid content payload", issues: parsed.error.issues });
    return;
  }
  try {
    const all = await loadAll();
    all[parsed.data.locale] = parsed.data.content;
    await saveAll(all);
    res.json({ ok: true, content: all });
  } catch (err) {
    req.log.error({ err }, "Failed to save content");
    res.status(500).json({ error: "Failed to save content" });
  }
});

// ---------- Admin: reset all locales to defaults ----------

router.post("/admin/content/reset", requireAdmin, async (req: Request, res: Response) => {
  try {
    await saveAll(defaultLocalizedContent);
    res.json({ ok: true, content: defaultLocalizedContent });
  } catch (err) {
    req.log.error({ err }, "Failed to reset content");
    res.status(500).json({ error: "Failed to reset content" });
  }
});

// ---------- Admin: translate EN to other locales ----------

const translateBodySchema = z.object({
  targets: z.array(localeSchema).optional(),
});

router.post("/admin/content/translate", requireAdmin, async (req: Request, res: Response) => {
  const parsed = translateBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
    return;
  }
  try {
    const all = await loadAll();
    const source = all[SOURCE_LOCALE];
    const targets = (parsed.data.targets ?? SUPPORTED_LOCALES.filter((l) => l !== SOURCE_LOCALE))
      .filter((l) => l !== SOURCE_LOCALE);

    const results: Record<string, "ok" | string> = {};
    for (const loc of targets) {
      try {
        const translated = await translateSiteContent(source, loc);
        // Preserve image fields from source so we don't lose uploaded media
        translated.images = source.images;
        translated.gallery = translated.gallery.map((g, i) => ({
          ...g,
          image: source.gallery[i]?.image ?? g.image,
        }));
        translated.contact.email = source.contact.email;
        translated.contact.instagram = source.contact.instagram;
        all[loc] = translated;
        results[loc] = "ok";
      } catch (err) {
        req.log.error({ err, loc }, "Translation failed");
        results[loc] = err instanceof Error ? err.message : "Translation failed";
      }
    }
    await saveAll(all);
    res.json({ ok: true, results, content: all });
  } catch (err) {
    req.log.error({ err }, "Translate route failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

// ---------- Public locale list ----------

router.get("/locales", (_req: Request, res: Response) => {
  res.json({ locales: SUPPORTED_LOCALES, source: SOURCE_LOCALE });
});

export default router;
