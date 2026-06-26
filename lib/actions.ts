"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import type { TransactionSql } from "postgres";
import { getSql, ensureSchema } from "@/lib/db";
import { requireUser, type CurrentUser } from "@/lib/session";

type Sql = ReturnType<typeof getSql>;
type Tx = TransactionSql<Record<string, never>>;

async function db(): Promise<Sql> {
  await ensureSchema();
  return getSql();
}

async function writeAudit(
  tx: Tx,
  actor: CurrentUser,
  action: string,
  status: string = "SUCCESS"
): Promise<void> {
  await tx`
    insert into audit_logs (action, actor_email, actor_role, ip_address, status)
    values (${action}, ${actor.email}, ${actor.role}, ${"10.0.0.1"}, ${status})
  `;
}

export async function createProject(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return;

  const user = await requireUser();
  const sql = await db();
  await sql.begin(async (tx) => {
    await tx`
      insert into projects (name, category, description)
      values (${name}, ${category}, ${description})
    `;
    await writeAudit(tx, user, `Created project "${name}"`);
  });

  revalidatePath("/projects");
  revalidatePath("/audit-logs");
  revalidatePath("/");
}

export async function addCredential(formData: FormData): Promise<void> {
  const projectId = Number(formData.get("projectId"));
  const serviceName = String(formData.get("serviceName") ?? "").trim();
  const environment = String(formData.get("environment") ?? "").trim();
  const secretValue = String(formData.get("secretValue") ?? "");
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const status = String(formData.get("status") ?? "Active").trim() || "Active";

  if (!projectId || !serviceName || !secretValue) return;

  const user = await requireUser();
  const sql = await db();
  await sql.begin(async (tx) => {
    await tx`
      insert into credentials
        (project_id, service_name, environment, secret_value, owner_email, department, status)
      values
        (${projectId}, ${serviceName}, ${environment}, ${secretValue}, ${ownerEmail}, ${department}, ${status})
    `;
    await writeAudit(tx, user, `Added credential "${serviceName}" (${environment || "n/a"})`);
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/credentials");
  revalidatePath("/audit-logs");
  revalidatePath("/");
}

export async function uploadDocument(formData: FormData): Promise<void> {
  const projectId = Number(formData.get("projectId"));
  const classification = String(formData.get("classification") ?? "").trim();
  const file = formData.get("file");

  if (!projectId || !(file instanceof File) || file.size === 0) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  const user = await requireUser();
  const sql = await db();
  await sql.begin(async (tx) => {
    await tx`
      insert into documents
        (project_id, file_name, file_size_bytes, sha256, uploaded_by, classification)
      values
        (${projectId}, ${file.name}, ${file.size}, ${sha256}, ${user.email}, ${classification})
    `;
    await writeAudit(tx, user, `Uploaded document "${file.name}"`);
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/compliance");
  revalidatePath("/audit-logs");
  revalidatePath("/");
}
