---
name: Supabase pooler + postgres.js
description: How to connect postgres.js to a Supabase transaction pooler and interpret auth errors.
---

# Supabase transaction pooler + postgres.js

When connecting `postgres.js` to a Supabase **transaction pooler** connection
string (host `*.pooler.supabase.com`, port `6543`):

- Pass `{ prepare: false }` — the transaction pooler does not support prepared
  statements; without this you get failures under load / on parameterized queries.
- Pass `{ ssl: "require" }` — Supabase requires TLS.
- The pooler username is `postgres.<project-ref>` (tenant routing), not plain
  `postgres`.

**Why:** These are non-obvious pooler constraints; missing `prepare:false` causes
intermittent errors that don't show up in a simple `select 1`.

## Interpreting "password authentication failed for user \"postgres\""
This error reports the **role** as `postgres` even when the connection string
username is `postgres.<ref>` — the `.ref` is only tenant routing, the underlying
role is `postgres`. So this error almost always means the **password is wrong**,
not the username/format.

**How to apply:** To isolate an encoding vs. credential problem, test the raw
connection string AND a version with `decodeURIComponent(password)` via explicit
`postgres({ host, port, username, password, database })` options. If BOTH fail
identically, postgres.js is decoding `%xx` fine and the password value itself is
incorrect — ask the user to verify / reset the Supabase database password rather
than fiddling with encoding.

`postgres.js` decodes percent-encoding in the URL itself, so `@` → `%40` in the
URL is correct and you should not double-decode.
