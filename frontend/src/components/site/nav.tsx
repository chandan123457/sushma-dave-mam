"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/about", label: "About" },
];

export function Nav({ name, designation, scholarUrl }: { name: string; designation: string; scholarUrl: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 bg-canvas/90 backdrop-blur-xl transition-[border-color,box-shadow] duration-300",
        scrolled || open ? "border-b border-hairline shadow-[0_1px_12px_rgb(10_23_48/0.04)]" : "border-b border-transparent",
      )}
    >
      <div className="site-container flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy font-heading text-[0.95rem] font-bold tracking-tight text-white">
            SD
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-[0.98rem] font-bold tracking-[-0.01em] text-fg">{name}</span>
            <span className="block text-[0.75rem] text-fg-muted">{designation}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                isActive(l.href) ? "bg-brand-soft text-brand" : "text-fg-2 hover:bg-subtle hover:text-fg",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-hairline-strong px-4 text-[0.875rem] font-medium text-fg transition-colors hover:border-fg-faint hover:bg-subtle"
            >
              <ScholarIcon />
              Google Scholar
            </a>
          )}
          <Link
            href="/#contact"
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-[0.875rem] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 5.5h12M3 9h12M3 12.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="site-container border-t border-hairline pb-6 pt-3 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block rounded-lg px-3 py-3 text-[1rem] font-medium",
                    isActive(l.href) ? "bg-brand-soft text-brand" : "text-fg hover:bg-subtle",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {scholarUrl && (
              <a href={scholarUrl} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center rounded-lg border border-hairline-strong text-sm font-medium">
                Google Scholar
              </a>
            )}
            <Link href="/#contact" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white">
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function ScholarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-brand">
      <path d="M12 3 1 9.5 5 12v5.5c0 .3.2.6.4.8C6.9 19.5 9.3 21 12 21s5.1-1.5 6.6-2.7c.2-.2.4-.5.4-.8V12l2-1.2V16h2V9.5L12 3Zm0 2.3 7.6 4.2L12 13.7 4.4 9.5 12 5.3Z" />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="M4 2h6v6M10 2 2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
