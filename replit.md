# PTK Academy School Website

A school website for PTK Academy (Zimbabwe) with a secure backend that proxies all Supabase operations — credentials never reach the browser.

## Run & Operate

- `pnpm --filter @workspace/ptk-academy run dev` — frontend dev server (port 19958, served at `/`)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080, served at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Required Secrets

Set these in Replit Secrets (never hardcode):
- `SUPABASE_URL` — your Supabase project URL (https://xxxx.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key from Supabase dashboard → Project Settings → API

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS + wouter routing
- API: Express 5 + pino structured logging
- DB: Supabase (external) — applications table
- Validation: Zod v3 (server), react-hook-form (client)
- API codegen: Orval (from OpenAPI spec)
- Password hashing: bcryptjs (12 salt rounds, server-side only)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ptk-academy/` — React frontend
- `artifacts/api-server/src/routes/applications/` — secure Supabase proxy route
- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `attached_assets/logo_1785137707793.png` — PTK logo (imported via @assets alias)

## Security Architecture

- **Service role key is SERVER-ONLY** — stored as a Replit Secret, used only in `artifacts/api-server/`
- The browser never sees Supabase credentials — the frontend calls `/api/applications`, not Supabase directly
- Passwords are hashed with bcryptjs (12 rounds) before being stored in Supabase
- Supabase client is instantiated fresh per request (no caching, so key rotation takes effect immediately)
- Duplicate email applications return a safe 400 error (no internal Supabase error leakage)
- Input validated server-side with Zod before any DB operation

## Supabase Table

Create this table in your Supabase dashboard (SQL Editor):

```sql
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Product

- 7-section school website: Home, Academic, School Fees, Sports, Clubs & Societies, Staff Directory, Contact
- PTK logo image in header and footer (replaces text logo)
- Animated image slider on hero
- "Apply Now" modal with secure form submission to Supabase via backend
- Live application count shown on hero ("Join X other applicants this year!")
- Social links: Facebook, Instagram, X/Twitter, LinkedIn, WhatsApp (+263778788197)
- School fees table (ZIMSEC/Cambridge × Day/Boarding)
- Payment methods: EcoCash (259104), CABS (1005234182), CBZ (01123987150010)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT use `format: email` in the OpenAPI spec — Orval generates `zod.email()` which only exists in Zod v4, breaking typecheck
- Supabase client must NOT be cached — always instantiate fresh per request
- The `@assets` Vite alias resolves to `attached_assets/` at the repo root

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
