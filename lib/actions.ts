"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { getSql, ensureSchema } from "@/lib/db";
import { CURRENT_USER } from "@/lib/current-user";

async function db() {
  await ensureSchema();
  return getSql();
}

async function writeAudit(
  action: string,
  status: string = "SUCCESS"
): Promise<void> {
  const sql = await db();
  await sql`
    insert into audit_logs (action, actor_email, actor_role, ip_address, status)
    values (${action}, ${CURRENT_USER.email}, ${CURRENT_USER.role}, ${"10.0.0.1"}, ${status})
  `;
}

export async function createProject(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return;

  const sql = await db();
  await sql`
    insert into projects (name, category, description)
    values (${name}, ${category}, ${description})
  `;
  await writeAudit(`Created project "${name}"`);

  revalidatePath("/projects");
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

  if (!projectId || !serviceName) return;

  const sql = await db();
  await sql`
    insert into credentials
      (project_id, service_name, environment, secret_value, owner_email, department, status)
    values
      (${projectId}, ${serviceName}, ${environment}, ${secretValue}, ${ownerEmail}, ${department}, ${status})
  `;
  await writeAudit(`Added credential "${serviceName}" (${environment || "n/a"})`);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/credentials");
  revalidatePath("/");
}

export async function uploadDocument(formData: FormData): Promise<void> {
  const projectId = Number(formData.get("projectId"));
  const classification = String(formData.get("classification") ?? "").trim();
  const file = formData.get("file");

  if (!projectId || !(file instanceof File) || file.size === 0) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  const sql = await db();
  await sql`
    insert into documents
      (project_id, file_name, file_size_bytes, sha256, uploaded_by, classification)
    values
      (${projectId}, ${file.name}, ${file.size}, ${sha256}, ${CURRENT_USER.email}, ${classification})
  `;
  await writeAudit(`Uploaded document "${file.name}"`);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/compliance");
  revalidatePath("/");
}
