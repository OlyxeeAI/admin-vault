import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
  getAdminEmail,
  getAdminRole,
} from "@/lib/auth";

export type CurrentUser = { email: string; role: string };

export async function getSession(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await getSession();
  return {
    email: session?.email ?? getAdminEmail(),
    role: getAdminRole(),
  };
}
