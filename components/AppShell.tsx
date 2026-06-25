"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderLock,
  KeyRound,
  ShieldCheck,
  ScrollText,
  Menu,
  X,
  Vault,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/current-user";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderLock },
  { href: "/credentials", label: "Credentials", icon: KeyRound },
  { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/audit-logs", label: "Audit Trail", icon: ScrollText },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = NAV.find((n) => isActive(pathname, n.href));

  const navList = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`tap flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium ${
              active
                ? "bg-gray-900 text-white shadow-ios"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon size={19} strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-ios">
        <Vault size={20} strokeWidth={2.2} />
      </div>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-gray-900">
          Olyxee Vault
        </p>
        <p className="text-[12px] text-gray-400">Secure Admin</p>
      </div>
    </div>
  );

  const userCard = (
    <div className="mx-3 mb-4 mt-2 flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-[13px] font-semibold text-white">
        {CURRENT_USER.email.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[13px] font-medium text-gray-900">
          {CURRENT_USER.email}
        </p>
        <p className="truncate text-[12px] text-gray-400">{CURRENT_USER.role}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-gray-200/70 bg-white lg:flex">
        <div>
          {brand}
          {navList}
        </div>
        {userCard}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 flex-col justify-between bg-white shadow-ios-md transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button
                onClick={() => setOpen(false)}
                className="tap flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {navList}
          </div>
          {userCard}
        </aside>
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="ios-glass sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200/60 px-4 py-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="tap flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-[15px] font-semibold text-gray-900">
            {current?.label ?? "Olyxee Vault"}
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
