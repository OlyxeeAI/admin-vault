# Olyxee Vault

A secure credentials & compliance vault admin app. Manage projects, store API
keys/secrets, track compliance documents (with SHA-256 checksums), and view an
immutable audit trail.

## Tech Stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4** — iOS-inspired design (frosted glass, soft shadows,
  continuous-corner radii, skeleton shimmer loaders)
- **postgres.js** — server-side data access to **Supabase Postgres**
- **lucide-react** — icons

## Architecture

- `app/` — App Router pages. Each data page is `force-dynamic` and fetches via
  server components. Route-level `loading.tsx` files provide skeleton states.
  - `/` dashboard, `/projects`, `/projects/[id]`, `/credentials`,
    `/compliance`, `/audit-logs`
- `components/` — `AppShell` (responsive sidebar + mobile drawer), reusable UI
  (`ui.tsx`, `Skeleton.tsx`), client widgets (forms, `SecretCell`, search tables).
- `lib/`
  - `db.ts` — lazy postgres.js client + `ensureSchema()` (runs `CREATE TABLE IF
    NOT EXISTS` once per process). Reads `SUPABASE_DB_URL`.
  - `queries.ts` — read functions (snake_case columns aliased to camelCase).
  - `actions.ts` — server actions for create project / add credential / upload
    document, each writing an audit log entry.
  - `format.ts` — display helpers (secret masking, file size, checksum, initials,
    accent color, environment colors).
  - `current-user.ts` — placeholder identity used for audit attribution.

## Database

Tables (snake_case): `projects`, `credentials`, `documents`, `audit_logs`.
Credentials and documents cascade-delete with their project. The schema is
created automatically on first DB access.

## Environment / Secrets

- `SUPABASE_DB_URL` — Supabase **transaction pooler** connection string
  (host `*.pooler.supabase.com`, port `6543`). The DB client uses `prepare:false`
  (required by the pooler) and `ssl: "require"`. URL-encode special characters in
  the password (e.g. `@` → `%40`).

## Development

- Workflow "Start application" runs `npm run dev` (`next dev` on `0.0.0.0:5000`).
- Deployment: autoscale, `build = npm run build`, `run = npm run start`.

## Notes

- Secrets are stored in plaintext; the "AES-256" label in the UI is presentational
  only (no real encryption layer is implemented).
- Authentication is not yet implemented; the current user is a placeholder
  (`siyanda@olyxee.com`, "Engineering Lead").

## User preferences

- Prefers Next.js (App Router) over other React setups for this project.
