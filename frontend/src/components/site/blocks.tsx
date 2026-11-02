import Link from "next/link";
import clsx from "clsx";
import type { Publication } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";
import { isSelf, nf, splitAuthors } from "@/lib/format";
import { Arrow } from "./nav";
import { Reveal } from "./motion";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <Reveal
      className={clsx(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "mx-auto")}>
        <p className={clsx("eyebrow", tone === "dark" && "!text-gold")}>{eyebrow}</p>
        <h2 className={clsx("h-section mt-3 text-[clamp(1.9rem,3.4vw,2.75rem)]", tone === "dark" ? "text-white" : "text-fg")}>{title}</h2>
        {description && (
          <p className={clsx("mt-4 text-[1.05rem] leading-relaxed", tone === "dark" ? "text-white/65" : "text-fg-muted")}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const cls = clsx(
    "group inline-flex items-center justify-center gap-2 text-[0.95rem] font-semibold transition-[background-color,border-color,color,box-shadow]",
    variant !== "ghost" && "h-12 rounded-xl px-6",
    variant === "primary" && "bg-brand text-white shadow-[0_8px_24px_-8px_rgb(15_61_115/0.55)] hover:bg-brand-hover",
    variant === "secondary" && "border border-hairline-strong bg-white text-fg hover:border-fg-faint hover:bg-subtle",
    variant === "ghost" && "text-brand hover:text-brand-hover",
    className,
  );
  const inner = (
    <>
      {children}
      <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Authors({ authors, className }: { authors: string; className?: string }) {
  const list = splitAuthors(authors);
  return (
    <p className={className}>
      {list.map((a, i) => (
        <span key={i}>
          <span className={isSelf(a) ? "font-semibold text-fg" : undefined}>{a}</span>
          {i < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export function TypeBadge({ type }: { type: Publication["type"] }) {
  return (
    <span className="inline-flex items-center rounded-md bg-brand-soft px-2 py-0.5 text-[0.72rem] font-semibold text-brand">
      {TYPE_LABEL[type]}
    </span>
  );
}

export function PublicationCard({ pub, compact = false }: { pub: Publication; compact?: boolean }) {
  return (
    <Link
      href={`/publications/${pub.slug}`}
      className={clsx(
        "group flex h-full gap-5 rounded-2xl border border-hairline bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-tint hover:shadow-[0_12px_32px_-12px_rgb(10_23_48/0.18)]",
        compact ? "p-5" : "p-6 md:p-7",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={pub.type} />
          {pub.year && <span className="text-[0.8rem] font-medium text-fg-muted">{pub.year}</span>}
        </div>
        <h3
          className={clsx(
            "mt-3 font-heading font-bold leading-snug tracking-[-0.015em] text-fg transition-colors group-hover:text-brand",
            compact ? "text-[1.02rem]" : "text-[1.15rem] md:text-[1.2rem]",
          )}
        >
          {pub.title}
        </h3>
        <Authors authors={pub.authors} className="mt-2 line-clamp-2 text-[0.875rem] leading-relaxed text-fg-muted" />
        {pub.venue && <p className="mt-1 line-clamp-1 text-[0.875rem] italic text-fg-2">{pub.venue}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between">
        {pub.citations > 0 ? (
          <div className="text-right">
            <p className="num text-[1.35rem] font-bold leading-none text-fg">{nf.format(pub.citations)}</p>
            <p className="mt-1 text-[0.72rem] text-fg-muted">citations</p>
          </div>
        ) : (
          <span />
        )}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-subtle text-fg-muted transition-colors group-hover:bg-brand group-hover:text-white">
          <Arrow />
        </span>
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
  const latest = data.at(-1)?.year;

  return (
    <figure className={clsx("flex gap-3", className)}>
      <div className="flex h-[240px] flex-col-reverse justify-between pb-6 text-right md:h-[280px]">
        {ticks.map((t) => (
          <span key={t} className="num -mb-2 text-[0.7rem] text-fg-faint">
            {t}
          </span>
        ))}
      </div>
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[calc(100%-24px)] flex-col-reverse justify-between">
          {ticks.map((t) => (
            <div key={t} className="border-t border-hairline" />
          ))}
        </div>
        <div className="relative flex h-[240px] items-end gap-1 pb-6 md:h-[280px] md:gap-2">
          {data.map((d) => (
            <div key={d.year} className="group relative flex h-full flex-1 flex-col justify-end">
              <div
                className={clsx(
                  "w-full rounded-t-[4px] transition-colors duration-200",
                  d.year === latest ? "bg-gold/80 group-hover:bg-gold" : "bg-brand/85 group-hover:bg-brand",
                )}
                style={{ height: `${(d.count / max) * 100}%` }}
              />
              <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[0.72rem] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {d.year}: {d.count}
              </span>
              <span className={clsx("num absolute left-1/2 top-full mt-1.5 -translate-x-1/2 text-[0.68rem] text-fg-muted", d.year % 2 === 1 && "max-sm:hidden")}>
                {String(d.year).slice(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
