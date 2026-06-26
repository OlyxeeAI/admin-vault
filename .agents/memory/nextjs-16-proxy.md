---
name: Next 16 proxy (renamed middleware)
description: Next.js 16 renamed the middleware file convention to proxy; what to name the file/function and the edge-safe import constraint.
---

# Next 16 `proxy.ts` (was `middleware.ts`)

Next.js 16 deprecated the `middleware` file convention in favor of `proxy`.
Using `middleware.ts` still works but logs a deprecation warning on dev start.

**Use:** file `proxy.ts` at project root, exporting `export async function
proxy(req: NextRequest)`. Keep `export const config = { matcher: [...] }` as
before. Behavior (route gating, redirects) is unchanged.

**Why:** removes the startup deprecation warning and is forward-compatible.

**How to apply:** the proxy runs on the edge runtime, so it must import only
edge-safe code. Session verification here imports from `lib/auth.ts` (Web
Crypto HMAC) and must NOT pull in `next/headers` or any Node-only module.
