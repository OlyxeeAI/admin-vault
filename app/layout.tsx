import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Olyxee Vault",
  description: "Secure credentials & compliance vault for Olyxee.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
