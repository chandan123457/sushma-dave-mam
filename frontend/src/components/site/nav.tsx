"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

const LINKS = [
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav({ scholarUrl }: { scholarUrl: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        open
          ? "border-b border-line bg-paper"
          : scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Home">
          <span className="font-serif text-[1.45rem] leading-none tracking-tight">Sushma Dave</span>
          <span className="label hidden translate-y-[-2px] sm:inline">Ph.D.</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const active = l.href !== "/#contact" && pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "link-draw pb-0.5 text-[0.9rem] transition-colors",
                  active ? "text-ink [background-size:100%_1px]" : "text-ink-2 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.8rem] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              Google Scholar
              <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </nav>

        <button
          type="button"
          className="relative -mr-2 flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={clsx("absolute h-px w-5 bg-ink transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
          <span className={clsx("absolute h-px w-5 bg-ink transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
        </button>
      </div>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-500 ease-out-expo md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav className="container-x overflow-hidden" aria-label="Mobile">
          <ul className="flex flex-col pb-6 pt-2">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-t border-line">
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4">
                  <span className="font-serif text-3xl">{l.label}</span>
                  <span className="label">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} aria-hidden>
      <path d="M1 9L9 1M9 1H2.5M9 1V7.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
