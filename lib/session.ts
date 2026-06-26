import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
  getAdminRole,
} from "@/lib/auth";

export type CurrentUser = { email: string; role: string };

export async function getSession(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  return { email: session.email, role: getAdminRole() };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: no valid admin session.");
  }
  return user;
}
