---
name: Blazor on Replit setup
description: Non-obvious gotchas for running this Blazor Web App (server + WASM client) on Replit with a Supabase database.
---

# Blazor Web App on Replit

This repo is a .NET 8 **Blazor Web App**: a server project (`Admin Vault`) plus a WASM client project (`Admin Vault.Client`). `App.razor` renders `<Routes @rendermode="InteractiveServer" />`, so **every page — even those physically in the WASM client project — actually executes on the server**.

## Render mode implication for data access
Because all pages run InteractiveServer, components can inject server-side DI services directly (no Web API needed). Pattern used here: POCO models + service *interface* live in the client project (no EF dependency, safe for WASM compile); the EF Core `DbContext` + service *implementation* live in the server project and are registered in server `Program.cs`.
**Why:** keeps the WASM project EF-free while letting client-project pages use a server data service at runtime.

## dotnet run port binding (workflow)
`dotnet run` honors `Properties/launchSettings.json` `applicationUrl` (e.g. localhost:5242) which **overrides `ASPNETCORE_URLS`**. The Replit workflow must pass `--no-launch-profile` so `ASPNETCORE_URLS=http://0.0.0.0:5000` actually takes effect.
**Why:** without it the app binds to the launchSettings port and never opens 5000, so the workflow times out waiting for the port.

## Proxy / HTTPS
Removed `app.UseHttpsRedirection()` entirely. Replit's edge terminates TLS and forwards HTTP to the container; redirecting to HTTPS inside causes loops. `AllowedHosts` is already `*`.

## Supabase connection string
`SUPABASE_DB_URL` is a libpq URI (`postgresql://user:pass@host:6543/db`, transaction pooler). Npgsql cannot parse a URI directly — `DatabaseConnection.BuildNpgsqlConnectionString` converts it to key/value form and forces `SslMode=Require` (Supabase requires SSL). Schema is created at startup via `EnsureCreated()`.
**Why:** passing the raw URI to `UseNpgsql` throws; SSL is mandatory for Supabase.

## Runtime / deployment
- Module: `dotnet-8.0` (projects target net8.0; the import shipped with dotnet-7.0 which can't build them).
- Deploy target: **VM** (not autoscale) because InteractiveServer keeps SignalR circuit state in server memory.
