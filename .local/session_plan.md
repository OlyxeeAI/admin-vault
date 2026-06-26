# Objective
Rebuild the "Olyxee Vault" admin app from .NET 8 Blazor into Next.js (App Router, TypeScript, Tailwind), porting all features and the iOS design, backed by the user's Supabase Postgres. DB is currently empty (Blazor never ran), so define a clean snake_case schema.

# Features to port
- Dashboard (stats: projects, credentials, compliance docs, audit triggers 24h, unauthorized 24h; recent credentials table; recent audit trail)
- Projects (list w/ key+doc counts, create project)
- Project detail (/projects/[id]): keys + docs under a project, add key, upload doc (sha256 + size)
- Credentials (global read-only search, masked secret reveal, project column, env badge)
- Compliance (global read-only search, checksum, size, classification)
- Audit logs (immutable ledger view)
- Audit logging on create/add actions; actor = siyanda@olyxee.com / Engineering Lead

# Tasks

### T001: Install Node + Next.js stack
- next, react, postgres (postgres.js), lucide-react, tailwind v4, typescript. DONE when package.json exists.

### T002: Project config
- next.config.ts (allowedDevOrigins), tsconfig, postcss, .gitignore, package.json scripts (dev on 0.0.0.0:5000).

### T003: DB layer
- lib/db.ts: postgres.js client (prepare:false for pooler, ssl require), ensureSchema() run-once.
- lib/types.ts, lib/format.ts (masked value, file size, initials, accent color, env colors).
- lib/queries.ts: mirror VaultDataService methods. lib/actions.ts: server actions w/ audit logging.

### T004: Global iOS styling + layout
- app/globals.css (Tailwind import + iOS tokens, skeleton shimmer, animations, scrollbars).
- app/layout.tsx + components/Sidebar.tsx (responsive mobile drawer, frosted header).

### T005: Pages + loaders
- app/page.tsx, projects, projects/[id], credentials, compliance, audit-logs.
- loading.tsx skeletons per route (Suspense). Empty states.

### T006: Workflow + deployment
- Update workflow to run `next dev` on 0.0.0.0:5000. Update .replit deployment (build: next build, run: next start).
- Request SUPABASE_DB_URL secret (encoded). Start, verify schema creation + UI.

### T007: Cleanup
- Remove Blazor projects (Admin Vault/, Admin Vault.Client/, .sln, publish/). Update replit.md. Code review.

# Notes
- Supabase pooler string: postgres.zjnoefeifrdrlbtyvfqg @ aws-0-eu-west-1.pooler.supabase.com:6543, transaction mode -> postgres.js MUST use prepare:false.
- Password has @ -> must be %40 encoded in URL.
