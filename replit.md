# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### tennis-portfolio (`/`)
Premium personal website for Victor Crosetto, a 12-year-old junior tennis player.
Dark cinematic ATP/Nike aesthetic with editorial typography.
- **Fonts**: Bebas Neue (display), Montserrat (sans), DM Sans (body), JetBrains Mono (mono)
- **Sections**: Hero, Player Profile, About, Achievements, Training, Gallery, Vision, Partners, Contact
- **Languages**: EN (source), FR, IT, DE, ES.
  - Public visitors switch language via the header pill (EN/FR/IT/DE/ES). Choice persists in `localStorage` (`site-language`) and falls back to browser language on first visit.
  - UI chrome strings (nav, contact form, footer) live in `src/i18n/uiStrings.ts`.
  - Editable site content is stored per-locale in `site_content` (jsonb under `content.<locale>`).
- **Content source**: live-edited via `GET /api/content?lang=<locale>` (falls back to `defaultContent.ts` if API unavailable).
- **Admin panel** at `/admin`:
  - Sign in with `ADMIN_PASSWORD` env var
  - Locale tabs (EN, FR, IT, DE, ES) — edit each language separately. EN is marked `·src` as the source of truth.
  - Edit every text field, list, card, and stat per-locale.
  - **Auto-translate** button ("Translate EN → FR · IT · DE · ES") calls `POST /api/admin/content/translate` to fill the four target locales from English using Anthropic Claude. Proper nouns (name, "Victor Crosetto"), emails, URLs, image URLs, training icon names, ticker codes, and 4-digit years are preserved verbatim.
  - Upload photos (hero, profile, gallery) directly from disk via `/api/storage` presigned URLs
  - Manage incoming inquiries from the contact form
  - "Reset all" returns ALL locales to defaults

### api-server (`/api`)
Express server backing the portfolio site.
- Routes:
  - `GET /healthz`
  - `GET /content?lang=<locale>` — public, returns `SiteContent` for one locale (defaults to `en`).
  - `GET /locales` — public, returns `{ source, locales }` advertising supported languages.
  - `GET /admin/content` — auth, returns full `LocalizedContent` (all 5 locales).
  - `PUT /admin/content` — auth, body `{ locale, content }`, replaces a single locale.
  - `POST /admin/content/reset` — auth, resets all locales to defaults.
  - `POST /admin/content/translate` — auth, optional `{ targets?: Locale[] }`, translates EN → targets via Anthropic Claude. Returns `{ ok, results, content }` where `results[locale]` is "ok" or an error string.
  - `/inquiries`, `/storage/*` (unchanged)
- Auth: HMAC-signed cookie (`vc_admin`) using `SESSION_SECRET`. Server refuses to start if `SESSION_SECRET` is unset or shorter than 16 chars.
- DB: `site_content` (singleton row, jsonb keyed by locale) and `inquiries` tables. Legacy single-locale rows are auto-migrated into `{ en: <legacy>, fr/it/de/es: defaults }` on first read.
- Translator: `src/lib/translator.ts` — Claude `claude-sonnet-4-6` via `@workspace/integrations-anthropic-ai`. Flattens `SiteContent` to `id → string`, skips `images.*`, `contact.email`, `contact.instagram`, training icon names, ticker codes, and 4-digit years. Output validated with Zod and merged back over the source structure.
- Object storage: Replit Object Storage via `@google-cloud/storage` for image uploads.

### Required environment variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set on Replit)
- `SESSION_SECRET` — HMAC secret for admin cookies
- `ADMIN_PASSWORD` — password used to sign in to `/admin`
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS` — Object Storage config
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic via Replit AI Integrations (auto-set by `setupReplitAIIntegrations`). Required for the admin auto-translate button.

## Codebase hygiene
- `src/components/ui/` is intentionally minimal — only the shadcn primitives the app actually uses are kept: `badge`, `button`, `card`, `input`, `label`, `tabs`, `textarea`, `toast`, `toaster`, `tooltip`. Do not re-add unused shadcn components or their Radix deps; install only what a real screen consumes.
- `package.json` deps are pruned to match. If you add a new UI primitive, add the matching dep at the same time.
