import { anthropic } from "@workspace/integrations-anthropic-ai";
import {
  siteContentSchema,
  type SiteContent,
  type Locale,
} from "./contentSchema";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "French (français)",
  it: "Italian (italiano)",
  de: "German (Deutsch)",
  es: "Spanish (español)",
};

const NON_TRANSLATABLE_EXACT: ReadonlySet<string> = new Set([
  "name",
  "firstName",
  "lastName",
  "stats.0.value",
  "stats.1.value",
  "stats.2.value",
  "heroStats.0.value",
  "heroStats.1.value",
  "heroStats.2.value",
  "profile.age",
  "profile.weeklyTraining",
  "contact.email",
  "contact.instagram",
  "images.hero",
  "images.profile",
]);

const NON_TRANSLATABLE_PREFIXES: readonly string[] = [
  "ticker.",
  "achievements.",
  "gallery.",
  "training.items.",
];

const NON_TRANSLATABLE_REGEX: readonly RegExp[] = [
  /^achievements\.\d+\.year$/,
  /^gallery\.\d+\.(image|id)$/,
  /^training\.items\.\d+\.icon$/,
];

function isProtectedPath(path: string): boolean {
  if (NON_TRANSLATABLE_EXACT.has(path)) return true;
  if (NON_TRANSLATABLE_PREFIXES.some((p) => path === p.slice(0, -1) || path.startsWith(p))) {
    // Ticker entries are pure brand tokens — never translate
    if (path.startsWith("ticker.")) return true;
    // For achievements/gallery/training.items, only specific sub-fields are protected; let regex decide
  }
  if (NON_TRANSLATABLE_REGEX.some((r) => r.test(path))) return true;
  return false;
}

const URL_LIKE = /^(https?:|\/objects\/|\/api\/storage\/|data:)/i;

function shouldTranslate(path: string, value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (value.trim().length === 0) return false;
  if (isProtectedPath(path)) return false;
  if (URL_LIKE.test(value)) return false;
  // Pure 4-digit year — never translate
  if (/^\d{4}$/.test(value.trim())) return false;
  return true;
}

interface FlatEntry {
  path: string;
  value: string;
}

function flattenStrings(
  node: unknown,
  prefix: string,
  out: FlatEntry[],
): void {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    node.forEach((item, idx) => flattenStrings(item, `${prefix}${prefix ? "." : ""}${idx}`, out));
    return;
  }
  if (typeof node === "object") {
    for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
      flattenStrings(val, `${prefix}${prefix ? "." : ""}${key}`, out);
    }
    return;
  }
  if (typeof node === "string") {
    if (shouldTranslate(prefix, node)) {
      out.push({ path: prefix, value: node });
    }
  }
}

function setByPath(target: Record<string, unknown> | unknown[], path: string, value: string): void {
  const parts = path.split(".");
  let cur: unknown = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (Array.isArray(cur)) {
      cur = cur[Number(k)];
    } else if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[k];
    } else {
      return;
    }
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    cur[Number(last)] = value;
  } else if (cur && typeof cur === "object") {
    (cur as Record<string, unknown>)[last] = value;
  }
}

const SYSTEM_PROMPT = `You are a professional sports-website translator. You translate marketing copy for an elite junior tennis player's portfolio.

Rules:
- Preserve tone: cinematic, premium, ATP/Nike-style.
- Keep proper nouns unchanged: "Victor Crosetto", "Milan", "ITF", "ATP", "U14", "Tennis Europe", "ITF Junior Circuit".
- NEVER translate the keys; only translate the string values.
- Return EXACTLY a single JSON object with the same keys as the input. Do not add commentary.
- Do not add or remove keys. Do not change the input order.
- Keep brand-style short labels short (do not pad them out).
- For tagline-like fields, prefer punchy phrasing over literal word-for-word.
- Output language: {{TARGET_LANGUAGE}}.`;

interface TranslateOptions {
  targetLocale: Locale;
}

async function translateMap(
  entries: FlatEntry[],
  opts: TranslateOptions,
): Promise<Record<string, string>> {
  if (entries.length === 0) return {};
  const inputObj: Record<string, string> = {};
  for (const e of entries) inputObj[e.path] = e.value;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT.replace("{{TARGET_LANGUAGE}}", LOCALE_NAMES[opts.targetLocale]),
    messages: [
      {
        role: "user",
        content: `Translate the string VALUES of this JSON object to ${LOCALE_NAMES[opts.targetLocale]}. Keep KEYS unchanged. Reply ONLY with the JSON, no markdown fences.\n\n${JSON.stringify(inputObj, null, 2)}`,
      },
    ],
  });

  const block = message.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Translator returned no text content");
  }
  const text = block.text.trim();
  // Strip optional ```json fences
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch (err) {
    throw new Error(`Translator returned invalid JSON: ${(err as Error).message}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Translator returned non-object JSON");
  }
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof v === "string") result[k] = v;
  }
  return result;
}

// Tokens that must appear verbatim in every translated string that contained them.
const PROTECTED_TOKENS: readonly string[] = [
  "Victor Crosetto",
  "Crosetto",
  "ITF",
  "ATP",
  "U14",
  "U16",
  "U18",
];

function violatesProtectedTokens(source: string, translated: string): string | null {
  for (const token of PROTECTED_TOKENS) {
    if (source.includes(token) && !translated.includes(token)) {
      return token;
    }
  }
  return null;
}

export async function translateSiteContent(
  source: SiteContent,
  targetLocale: Locale,
): Promise<SiteContent> {
  const cloneText = JSON.stringify(source);
  const target = JSON.parse(cloneText) as SiteContent;
  const entries: FlatEntry[] = [];
  flattenStrings(source, "", entries);

  const translated = await translateMap(entries, { targetLocale });

  for (const e of entries) {
    const newValue = translated[e.path];
    if (typeof newValue !== "string" || newValue.length === 0) {
      // Translator omitted this field — keep source value (already cloned).
      continue;
    }
    // Guardrail: if the source contained a protected proper noun and the translation dropped it,
    // restore the source rather than write a corrupted translation.
    const dropped = violatesProtectedTokens(e.value, newValue);
    if (dropped) {
      continue;
    }
    setByPath(target as unknown as Record<string, unknown>, e.path, newValue);
  }

  // Validate output against schema
  const parsed = siteContentSchema.safeParse(target);
  if (!parsed.success) {
    throw new Error(
      `Translated content failed schema validation: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    );
  }
  return parsed.data;
}
