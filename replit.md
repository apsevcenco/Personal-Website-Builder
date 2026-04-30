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
- **Content source**: live-edited via `/api/content` (falls back to `defaultContent.ts` if API unavailable)
- **Admin panel** at `/admin`:
  - Sign in with `ADMIN_PASSWORD` env var
  - Edit every text field, list, card, and stat
  - Upload photos (hero, profile, gallery) directly from disk via `/api/storage` presigned URLs
  - Manage incoming inquiries from the contact form
  - "Reset to defaults" returns all content to baseline

### api-server (`/api`)
Express server backing the portfolio site.
- Routes: `/healthz`, `/content`, `/admin/*`, `/inquiries`, `/storage/*`
- Auth: HMAC-signed cookie (`vc_admin`) using `SESSION_SECRET`. Server refuses to start if `SESSION_SECRET` is unset or shorter than 16 chars.
- DB: `site_content` (singleton row, jsonb) and `inquiries` tables.
- Object storage: Replit Object Storage via `@google-cloud/storage` for image uploads.

### Required environment variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set on Replit)
- `SESSION_SECRET` — HMAC secret for admin cookies
- `ADMIN_PASSWORD` — password used to sign in to `/admin`
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS` — Object Storage config
