"use client";

import { useDeferredValue, useMemo, useState } from "react";
import clsx from "clsx";
import type { Publication, PublicationType } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { PublicationCard } from "./blocks";

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

  // Group by year when browsing chronologically.
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
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="space-y-8 lg:sticky lg:top-[100px]">
          <label className="relative block">
            <span className="sr-only">Search publications</span>
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search publications"
              className="h-11 w-full rounded-xl border border-hairline-strong bg-white pl-10 pr-3 text-[0.92rem] outline-none transition-[border-color,box-shadow] placeholder:text-fg-faint focus:border-brand focus:shadow-[0_0_0_4px_rgb(15_61_115/0.1)]"
            />
          </label>

          <div>
            <p className="mb-2 text-[0.8rem] font-semibold text-fg-muted">Type</p>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              <FilterItem active={type === "all"} onClick={() => setType("all")} count={publications.length}>
                All publications
              </FilterItem>
              {types.map(([t, n]) => (
                <FilterItem key={t} active={type === t} onClick={() => setType(t)} count={n}>
                  {TYPE_LABEL[t]}s
                </FilterItem>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[0.8rem] font-semibold text-fg-muted">Sort by</p>
            <div className="grid grid-cols-2 rounded-xl bg-subtle-2 p-1" role="radiogroup" aria-label="Sort">
              {(["recent", "cited"] as const).map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={sort === s}
                  onClick={() => setSort(s)}
                  className={clsx(
                    "rounded-lg py-2 text-[0.85rem] font-semibold transition-colors",
                    sort === s ? "bg-white text-fg shadow-sm" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {s === "recent" ? "Newest" : "Most cited"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-9">
        <p className="text-[0.9rem] text-fg-muted">
          Showing <span className="font-semibold text-fg">{filtered.length}</span> of {publications.length}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-hairline-strong py-20 text-center">
            <p className="h-section text-xl">No publications match “{query}”.</p>
            <button
              onClick={() => {
                setQuery("");
                setType("all");
              }}
              className="mt-3 text-sm font-semibold text-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.key} className="mt-8">
              <h2 className="sticky top-[72px] z-10 -mx-1 flex items-baseline gap-3 bg-canvas/95 px-1 py-3 backdrop-blur">
                <span className="num text-[1.5rem] font-extrabold text-fg">{g.key}</span>
                <span className="text-[0.85rem] text-fg-muted">
                  {g.items.length} {g.items.length === 1 ? "publication" : "publications"}
                </span>
              </h2>
              <div className="mt-2 space-y-3">
                {g.items.map((p) => (
                  <PublicationCard key={p.id} pub={p} compact />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function FilterItem({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
  return (
    <li>
      <button
        onClick={onClick}
        aria-pressed={active}
        className={clsx(
          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[0.9rem] font-medium transition-colors",
          active ? "bg-brand-soft text-brand" : "text-fg-2 hover:bg-subtle max-lg:border max-lg:border-hairline",
        )}
      >
        {children}
        <span className={clsx("num text-[0.8rem]", active ? "text-brand" : "text-fg-faint")}>{count}</span>
      </button>
    </li>
  );
}
