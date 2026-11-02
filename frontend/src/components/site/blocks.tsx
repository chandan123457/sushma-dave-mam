import Link from "next/link";
import clsx from "clsx";
import type { Publication } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { isSelf, nf, splitAuthors } from "@/lib/format";
import { Arrow } from "./nav";
import { Reveal } from "./motion";

export function SectionHead({
  index,
  label,
  title,
  aside,
  className,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("grid gap-6 border-t border-line-strong pt-6 md:grid-cols-12", className)}>
      <p className="label flex gap-4 md:col-span-3">
        <span className="text-ink">{index}</span>
        <span>{label}</span>
      </p>
      <Reveal className="md:col-span-7">
        <h2 className="display text-[clamp(2.25rem,4.6vw,4rem)]">{title}</h2>
      </Reveal>
      {aside && <div className="flex items-end md:col-span-2 md:justify-end">{aside}</div>}
    </div>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={clsx("group inline-flex items-center gap-2 text-[0.9rem]", className)}>
      <span className="link-draw pb-0.5">{children}</span>
      <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function Authors({ authors, className }: { authors: string; className?: string }) {
  const list = splitAuthors(authors);
  return (
    <p className={className}>
      {list.map((a, i) => (
        <span key={i}>
          <span className={isSelf(a) ? "font-medium text-ink underline decoration-accent/40 underline-offset-[3px]" : undefined}>{a}</span>
          {i < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export function PublicationRow({
  pub,
  index,
  showType = false,
  showYear = true,
}: {
  pub: Publication;
  index?: number;
  showType?: boolean;
  showYear?: boolean;
}) {
  const gutter = index !== undefined || showYear;
  return (
    <Link
      href={`/publications/${pub.slug}`}
      className={clsx(
        "group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-t border-line py-6 transition-colors md:py-7",
        gutter ? "md:grid-cols-[72px_1fr_120px]" : "md:grid-cols-[1fr_120px]",
      )}
    >
      {gutter && (
        <span className="label hidden pt-1.5 md:block">
          {index !== undefined ? String(index + 1).padStart(2, "0") : pub.year ?? "—"}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="font-serif text-[1.35rem] leading-[1.2] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent md:text-[1.55rem]">
          {pub.title}
        </h3>
        <Authors authors={pub.authors} className="mt-2 text-[0.85rem] leading-relaxed text-muted" />
        <p className="mt-1 text-[0.85rem] italic leading-relaxed text-ink-2">
          {pub.venue}
          {pub.year && <span className="not-italic text-muted"> · {pub.year}</span>}
        </p>
        {showType && <p className="label mt-3">{TYPE_LABEL[pub.type]}</p>}
      </div>
      <div className="flex flex-col items-end justify-between gap-3 text-right">
        <p className="font-mono text-[0.8rem] text-ink-2">
          {pub.citations > 0 ? (
            <>
              <span className="text-[1.05rem] text-ink">{nf.format(pub.citations)}</span>
              <span className="ml-1.5 text-muted">cit.</span>
            </>
          ) : (
            <span className="text-faint">—</span>
          )}
        </p>
        <Arrow className="text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent group-hover:opacity-100" />
      </div>
    </Link>
  );
}

export function CitationChart({ data, className }: { data: { year: number; count: number }[]; className?: string }) {
  const peak = Math.max(...data.map((d) => d.count), 1);
  // Round the axis to a 1/2/5 × 10ⁿ step so gridlines land on clean numbers.
  const raw = peak / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  const max = Math.ceil(peak / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
  return (
    <figure className={className}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 flex flex-col-reverse justify-between">
          {ticks.map((t, i) => (
            <div key={i} className="relative border-t border-dashed border-line">
              <span className="absolute -top-2.5 right-full mr-3 font-mono text-[0.65rem] text-faint">{t}</span>
            </div>
          ))}
        </div>
        <div className="relative ml-0 flex h-[260px] items-end gap-[3px] sm:gap-2 md:h-[300px]">
          {data.map((d, i) => (
            <div key={d.year} className="group relative flex h-full flex-1 items-end">
              <Reveal y={0} delay={i * 0.04} className="relative h-full w-full origin-bottom">
                <div
                  className="absolute bottom-0 w-full bg-ink/85 transition-colors duration-300 group-hover:bg-accent"
                  style={{ height: `${(d.count / max) * 100}%` }}
                />
              </Reveal>
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 font-mono text-[0.7rem] text-paper opacity-0 transition-opacity group-hover:opacity-100">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-[3px] sm:gap-2">
        {data.map((d, i) => (
          <span
            key={d.year}
            className={clsx(
              "flex-1 text-center font-mono text-[0.6rem] text-muted sm:text-[0.65rem]",
              i % 2 === 1 && "max-sm:invisible",
            )}
          >
            ’{String(d.year).slice(2)}
          </span>
        ))}
      </div>
    </figure>
  );
}
