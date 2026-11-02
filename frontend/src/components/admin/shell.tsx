"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";
import { ToastProvider } from "./ui";

const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard" }] },
  {
    group: "Content",
    items: [
      { href: "/admin/profile", label: "Profile & bio" },
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/research", label: "Research areas" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/news", label: "News" },
      { href: "/admin/awards", label: "Awards & service" },
      { href: "/admin/collaborators", label: "Collaborators" },
    ],
  },
  {
    group: "Library",
    items: [
      { href: "/admin/media", label: "Files & media" },
      { href: "/admin/messages", label: "Messages" },
    ],
  },
  { group: "Settings", items: [{ href: "/admin/account", label: "Account" }] },
];

type Admin = { email: string; name: string };

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Every admin request is protected server-side; a 401 here sends the visitor to the login page.
  useEffect(() => {
    api.me().then((r) => setAdmin(r.admin)).catch(() => {});
  }, []);

  async function logout() {
    await api.logout().catch(() => {});
    router.replace("/admin/login");
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <Link href="/admin" className="block">
          <span className="font-serif text-[1.6rem] leading-none text-paper">Sushma Dave</span>
          <span className="mt-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper/40">Studio · Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {NAV.map((g) => (
          <div key={g.group} className="mb-6">
            <p className="px-3 pb-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper/30">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      "relative flex items-center rounded-lg px-3 py-2 text-[0.86rem] transition-colors",
                      isActive(item.href) ? "bg-paper/[0.08] text-paper" : "text-paper/60 hover:bg-paper/[0.04] hover:text-paper",
                    )}
                  >
                    {isActive(item.href) && <span className="absolute -left-3 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-[#7fc3a8]" />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-paper/10 p-4">
        <a href="/" target="_blank" rel="noreferrer" className="mb-3 flex items-center justify-between rounded-lg px-3 py-2 text-[0.82rem] text-paper/60 hover:bg-paper/[0.04] hover:text-paper">
          View live site <span aria-hidden>↗</span>
        </a>
        <div className="flex items-center gap-3 px-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7fc3a8]/20 font-serif text-sm text-[#a9dcc6]">
            {admin?.name.replace(/^Dr\.?\s*/i, "").charAt(0)}
          </span>
          {admin ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem] text-paper">{admin.name}</p>
              <p className="truncate text-[0.7rem] text-paper/40">{admin.email}</p>
            </div>
          ) : (
            <div className="flex-1 space-y-1.5">
              <span className="block h-2.5 w-24 animate-pulse rounded bg-paper/10" />
              <span className="block h-2 w-32 animate-pulse rounded bg-paper/5" />
            </div>
          )}
          <button onClick={logout} className="text-[0.72rem] text-paper/50 hover:text-paper" title="Sign out">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-paper">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] bg-night lg:block">{sidebar}</aside>

        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-5 backdrop-blur lg:hidden">
          <span className="font-serif text-xl">Studio</span>
          <button onClick={() => setMenuOpen(true)} className="text-sm text-ink-2">
            Menu
          </button>
        </div>
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-night/50" onClick={() => setMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-[280px] bg-night [animation:fade-in_.2s_ease]">{sidebar}</aside>
          </div>
        )}

        <main className="lg:pl-[264px]">
          <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
