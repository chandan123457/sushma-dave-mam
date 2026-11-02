import { Reveal } from "./motion";

/** Title band at the top of inner pages. */
export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-hairline bg-subtle pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_90%_0%,var(--brand-soft),transparent_70%)]" />
      <div className="site-container relative py-14 md:py-20">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-display mt-3 text-[clamp(2.4rem,5vw,3.75rem)] text-fg">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-fg-muted">{description}</p>}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
