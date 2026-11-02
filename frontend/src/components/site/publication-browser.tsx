"use client";

import { useDeferredValue, useMemo, useState } from "react";
import clsx from "clsx";
import type { Publication, PublicationType } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { PublicationRow } from "./blocks";

type Sort = "recent" | "cited";

export function PublicationBrowser({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PublicationType | "all">("all");
  const [sort, setSort] = useState<Sort>("recent");
  const deferredQuery = useDeferredValue(query);

  const types = useMemo(() => {
    const counts = new Map<PublicationType, number>();
    publications.forEach((p) => counts.set(p.type, (counts.get(p.type) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [publications]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = publications.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        (!q || `${p.title} ${p.authors} ${p.venue} ${p.year ?? ""}`.toLowerCase().includes(q)),
    );
    return sort === "cited"
      ? [...list].sort((a, b) => b.citations - a.citations)
      : [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || b.citations - a.citations);
  }, [publications, deferredQuery, type, sort]);

  // Group by year when browsing chronologically — reads like a CV.
  const groups = useMemo(() => {
    if (sort === "cited") return [{ key: "Most cited", items: filtered }];
    const map = new Map<string, Publication[]>();
    filtered.forEach((p) => {
      const key = p.year ? String(p.year) : "Undated";
      map.set(key, [...(map.get(key) ?? []), p]);
    });
    return [...map.entries()].map(([key, items]) => ({ key, items }));
  }, [filtered, sort]);

  return (
    <div>
      <div className="z-30 -mx-[clamp(1.25rem,4vw,3rem)] border-b border-line bg-paper/90 px-[clamp(1.25rem,4vw,3rem)] py-4 backdrop-blur-md md:sticky md:top-[72px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex-1 lg:max-w-md">
            <span className="sr-only">Search publications</span>
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, journal or year"
              className="w-full border-b border-line-strong bg-transparent py-2.5 pl-7 text-[0.95rem] outline-none transition-colors placeholder:text-faint focus:border-ink"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Chip active={type === "all"} onClick={() => setType("all")}>
              All <span className="opacity-50">{publications.length}</span>
            </Chip>
            {types.map(([t, n]) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>
                {TYPE_LABEL[t]} <span className="opacity-50">{n}</span>
              </Chip>
            ))}
            <span className="mx-2 hidden h-5 w-px bg-line-strong sm:block" />
            <div className="flex rounded-full border border-line-strong p-0.5" role="radiogroup" aria-label="Sort">
              {(["recent", "cited"] as const).map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={sort === s}
                  onClick={() => setSort(s)}
                  className={clsx(
                    "rounded-full px-3.5 py-1.5 text-[0.78rem] transition-colors",
                    sort === s ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {s === "recent" ? "Newest" : "Most cited"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="label mt-8">
        Showing {filtered.length} of {publications.length}
      </p>

      {filtered.length === 0 ? (
        <div className="border-t border-line py-24 text-center">
          <p className="font-serif text-3xl">Nothing matches “{query}”.</p>
          <button onClick={() => { setQuery(""); setType("all"); }} className="mt-4 text-sm text-muted underline underline-offset-4 hover:text-ink">
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mt-10 grid gap-x-8 md:grid-cols-12">
            <h2 className="mb-4 md:col-span-2 md:mb-0">
              <span className="sticky top-40 block font-serif text-4xl leading-none tracking-tight text-ink md:text-5xl">
                {g.key}
              </span>
              <span className="label mt-2 block">{g.items.length} {g.items.length === 1 ? "item" : "items"}</span>
            </h2>
            <div className="border-b border-line md:col-span-10">
              {g.items.map((p) => (
                <PublicationRow key={p.id} pub={p} showType showYear={sort === "cited"} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "rounded-full border px-3.5 py-1.5 text-[0.78rem] transition-colors",
        active ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-2 hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
