import Link from "next/link";
import { getCollaborators, getNews, getProfile, getPublications, getResearch } from "@/lib/data";
import { formatDate, nf } from "@/lib/format";
import { ButtonLink, CitationChart, PublicationCard, SectionHeader } from "@/components/site/blocks";
import { CountUp, Reveal } from "@/components/site/motion";
import { ContactForm } from "@/components/site/contact-form";
import { ResearchIcon } from "@/components/site/icons";
import { Arrow, ExternalArrow } from "@/components/site/nav";

// Layout for the research grid: two wide cards, then three.
const RESEARCH_SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export default async function HomePage() {
  const [profile, pubs, research, collaborators, news] = await Promise.all([
    getProfile(),
    getPublications(),
    getResearch(),
    getCollaborators(),
    getNews(),
  ]);

  const featured = pubs.filter((p) => p.featured);
  const selected = [...(featured.length >= 4 ? featured : pubs)].sort((a, b) => b.citations - a.citations).slice(0, 6);
  const books = pubs.filter((p) => p.type === "book");
  const s = profile.stats;
  const teachingSince = Number(profile.education.find((e) => /ph\.?d/i.test(e.degree))?.year) || null;
  const yearsActive = teachingSince ? new Date(profile.updatedAt).getFullYear() - teachingSince : null;

  const byYear = profile.citationsByYear;
  const current = byYear.at(-1);
  const peak = byYear.reduce((a, b) => (b.count > a.count ? b : a), byYear[0] ?? { year: 0, count: 0 });
  const impact = [
    { label: "Peak year", value: peak.year, note: `${nf.format(peak.count)} citations` },
    {
      label: `Since ${s.recentSince}`,
      value: `${Math.round((s.citations.recent / Math.max(s.citations.all, 1)) * 100)}%`,
      note: "of all citations",
    },
    { label: current ? `${current.year} so far` : "This year", value: nf.format(current?.count ?? 0), note: "citations" },
  ];

  const metrics = [
    { value: s.citations.all, label: "Citations", note: `${nf.format(s.citations.recent)} since ${s.recentSince}` },
    { value: s.hIndex.all, label: "h-index", note: `${s.hIndex.recent} since ${s.recentSince}` },
    { value: s.i10Index.all, label: "i10-index", note: `${s.i10Index.recent} since ${s.recentSince}` },
    { value: pubs.length, label: "Publications", note: `Including ${books.length} books` },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[72px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_10%,var(--brand-soft),transparent_70%)]" />
        <div className="site-container relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3.5 py-1.5 text-[0.8rem] font-medium text-fg-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gold" />
                {profile.designation} · {profile.institution}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h-display mt-6 text-[clamp(2.75rem,6.4vw,5rem)] text-fg">
                {profile.honorific} {profile.name}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[38rem] text-[1.125rem] leading-[1.7] text-fg-2 md:text-[1.2rem]">{profile.tagline}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/publications">View publications</ButtonLink>
                <ButtonLink href="/#contact" variant="secondary">
                  Get in touch
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-12 border-t border-hairline pt-6">
                <p className="text-[0.8rem] font-semibold text-fg-muted">Research interests</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <li key={i} className="rounded-lg bg-subtle px-3 py-1.5 text-[0.85rem] font-medium text-fg-2">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative mx-auto max-w-[420px]">
              <div
                className="absolute -right-4 -top-4 h-full w-full rounded-[28px] border border-gold/40 bg-[radial-gradient(rgb(176_138_62/0.28)_1.2px,transparent_1.4px),linear-gradient(135deg,#f6efe0,#ead9b6)] [background-size:14px_14px,100%_100%]"
                aria-hidden
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-subtle-2 ring-1 ring-hairline">
                {profile.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt={`Portrait of ${profile.honorific} ${profile.name}`}
                    className="h-full w-full object-cover object-top"
                    fetchPriority="high"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -left-4 rounded-2xl border border-hairline bg-white p-4 shadow-[0_20px_40px_-16px_rgb(10_23_48/0.3)] sm:-left-8 sm:p-5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-fg-muted">Google Scholar</p>
                <div className="mt-2 flex items-end gap-5">
                  <div>
                    <p className="num text-[1.75rem] font-extrabold leading-none text-fg">{nf.format(s.citations.all)}</p>
                    <p className="mt-1 text-[0.75rem] text-fg-muted">citations</p>
                  </div>
                  <div className="h-10 w-px bg-hairline" />
                  <div>
                    <p className="num text-[1.75rem] font-extrabold leading-none text-fg">{s.hIndex.all}</p>
                    <p className="mt-1 text-[0.75rem] text-fg-muted">h-index</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Metrics ──────────────────────────────────────────── */}
      <section className="site-container pb-20 pt-10 md:pb-28">
        <Reveal>
          <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-hairline bg-white lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`p-6 md:p-8 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${i >= 2 ? "border-t border-hairline lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="text-[0.85rem] font-semibold text-fg-muted">{m.label}</dt>
                <dd className="num mt-2 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none text-navy">
                  <CountUp value={m.value} />
                </dd>
                <dd className="mt-2 text-[0.8rem] text-fg-muted">{m.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <section className="bg-subtle py-20 md:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="About" title="Chemist, educator and author" />
            {yearsActive && (
              <Reveal delay={0.05}>
                <p className="mt-8 flex items-baseline gap-3">
                  <span className="num text-6xl font-extrabold text-brand">{yearsActive}+</span>
                  <span className="max-w-[10rem] text-[0.9rem] leading-snug text-fg-muted">years of teaching and research</span>
                </p>
              </Reveal>
            )}
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[1.15rem] leading-[1.75] text-fg-2">{profile.shortBio}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                {profile.education.map((e) => (
                  <li key={e.degree} className="rounded-xl border border-hairline bg-white p-4">
                    <p className="num text-[0.85rem] font-bold text-brand">{e.year}</p>
                    <p className="mt-1.5 font-heading text-[0.98rem] font-bold text-fg">{e.degree}</p>
                    {e.institution && <p className="mt-0.5 text-[0.82rem] leading-snug text-fg-muted">{e.institution}</p>}
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/about" variant="ghost" className="mt-8">
                Read full biography
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Research ─────────────────────────────────────────── */}
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          eyebrow="Research"
          title="Areas of research"
          description="Work that connects fundamental electrochemistry with applied problems in health and the environment."
          action={<ButtonLink href="/research" variant="secondary">All research</ButtonLink>}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {research.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.04} className={RESEARCH_SPANS[i] ?? "lg:col-span-2"}>
              <Link
                href={`/research#area-${r.id}`}
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-tint hover:shadow-[0_16px_40px_-16px_rgb(10_23_48/0.2)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ResearchIcon title={r.title} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-heading text-[1.25rem] font-bold leading-snug tracking-[-0.015em] text-fg">{r.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-fg-muted">{r.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-brand">
                  Learn more <Arrow className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Selected publications ────────────────────────────── */}
      <section className="bg-subtle py-20 md:py-28">
        <div className="site-container">
          <SectionHeader
            eyebrow="Publications"
            title="Selected publications"
            description="The most-cited journal articles and book chapters."
            action={<ButtonLink href="/publications" variant="secondary">All {pubs.length} publications</ButtonLink>}
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {selected.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.05} className="h-full">
                <PublicationCard pub={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ───────────────────────────────────────────── */}
      <section className="site-container py-20 md:py-28">
        <SectionHeader
          eyebrow="Research impact"
          title="Citations over time"
          description={`${nf.format(s.citations.recent)} of ${nf.format(s.citations.all)} total citations have come since ${s.recentSince}.`}
        />
        <Reveal delay={0.05}>
          <div className="mt-12 grid overflow-hidden rounded-2xl border border-hairline bg-white lg:grid-cols-12">
            <div className="p-6 pt-12 md:p-10 md:pt-14 lg:col-span-8">
              <CitationChart data={profile.citationsByYear} />
            </div>
            <div className="grid grid-cols-3 border-t border-hairline bg-subtle lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0">
              {impact.map((item, i) => (
                <div key={item.label} className={`flex flex-col justify-center p-5 md:p-8 ${i > 0 ? "border-l border-hairline lg:border-l-0 lg:border-t" : ""}`}>
                  <p className="text-[0.8rem] font-semibold text-fg-muted">{item.label}</p>
                  <p className="num mt-1 text-[1.9rem] font-extrabold leading-none text-navy">{item.value}</p>
                  <p className="mt-1 text-[0.78rem] text-fg-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-fg-muted">
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-brand/85" /> Citations per year
              </span>
              {current && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-gold/80" /> {current.year} to date
                </span>
              )}
            </span>
            <span className="text-fg-faint">Source: Google Scholar</span>
          </div>
        </Reveal>
      </section>

      {/* ── Books ────────────────────────────────────────────── */}
      {books.length > 0 && (
        <section className="bg-navy py-20 md:py-28">
          <div className="site-container">
            <SectionHeader
              tone="dark"
              eyebrow="Books"
              title="Edited volumes"
              description="Published with Springer Nature, Wiley-VCH, Elsevier and CRC Press."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((b, i) => (
                <Reveal key={b.id} delay={(i % 3) * 0.05}>
                  <Link
                    href={`/publications/${b.slug}`}
                    className="group flex h-full gap-5 rounded-2xl border border-white/10 bg-navy-2 p-5 transition-colors hover:border-white/25 hover:bg-[#182a4b]"
                  >
                    <div className="relative flex aspect-[3/4] w-24 shrink-0 flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-brand to-[#081a35] p-2.5 shadow-[0_12px_24px_-10px_rgb(0_0_0/0.6)]">
                      {b.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <>
                          <span className="h-0.5 w-6 bg-gold" />
                          <span className="line-clamp-4 font-heading text-[0.6rem] font-bold leading-tight text-white">{b.title}</span>
                        </>
                      )}
                    </div>
                    <div className="min-w-0 py-1">
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-gold">
                        {[b.publisher?.replace(/:.*$/, ""), b.year].filter(Boolean).join(" · ")}
                      </p>
                      <h3 className="mt-2 font-heading text-[1.02rem] font-bold leading-snug text-white">{b.title}</h3>
                      <p className="mt-2 line-clamp-2 text-[0.82rem] text-white/55">{b.authors}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── News & collaborators ─────────────────────────────── */}
      <section className="site-container grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
        {news.length > 0 && (
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="News" title="Latest updates" />
            <ol className="relative mt-10 space-y-8 border-l border-hairline pl-6">
              {news.slice(0, 4).map((n) => (
                <Reveal as="li" key={n.id} className="relative">
                  <span className="absolute -left-[29.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand ring-1 ring-brand" />
                  <time className="text-[0.8rem] font-semibold text-brand" dateTime={n.date}>
                    {/* A 1 January date means only the year is known. */}
                    {n.date.endsWith("-01-01") ? n.date.slice(0, 4) : formatDate(n.date, { month: "long", year: "numeric" })}
                  </time>
                  <p className="mt-1 font-heading text-[1.02rem] font-bold leading-snug text-fg">
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noreferrer" className="hover:text-brand">
                        {n.title}
                      </a>
                    ) : (
                      n.title
                    )}
                  </p>
                  {n.body && <p className="mt-1.5 text-[0.9rem] leading-relaxed text-fg-muted">{n.body}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        )}

        {collaborators.length > 0 && (
          <div className={news.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
            <SectionHeader eyebrow="Collaborations" title="Co-authors and collaborators" />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {collaborators.map((c) => (
                <li key={c.id} className="flex items-start gap-3 rounded-xl border border-hairline bg-white p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-heading text-[0.8rem] font-bold text-brand">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-[0.92rem] font-bold text-fg">{c.name}</p>
                    {c.affiliation && <p className="mt-0.5 line-clamp-2 text-[0.8rem] leading-snug text-fg-muted">{c.affiliation}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-20 bg-subtle py-20 md:py-28">
        <div className="site-container">
          <div className="grid overflow-hidden rounded-3xl border border-hairline bg-white shadow-[0_24px_60px_-30px_rgb(10_23_48/0.25)] lg:grid-cols-12">
            <div className="relative overflow-hidden bg-navy p-8 text-white md:p-12 lg:col-span-5">
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
              <p className="eyebrow !text-gold">Contact</p>
              <h2 className="h-section mt-3 text-[clamp(1.9rem,3.2vw,2.5rem)]">Get in touch</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-white/65">
                For research collaboration, doctoral supervision, invited lectures and editorial work.
              </p>
              <dl className="relative mt-10 space-y-6">
                <ContactRow label="Email">
                  <a href={`mailto:${profile.email}`} className="break-all hover:underline">
                    {profile.email}
                  </a>
                  {profile.altEmail && (
                    <a href={`mailto:${profile.altEmail}`} className="mt-1 block break-all text-white/60 hover:text-white">
                      {profile.altEmail}
                    </a>
                  )}
                </ContactRow>
                <ContactRow label="Institution">
                  {profile.department}
                  <span className="block text-white/60">{profile.institution}</span>
                </ContactRow>
                <ContactRow label="Location">{profile.location}</ContactRow>
              </dl>
              {profile.scholarUrl && (
                <a
                  href={profile.scholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-10 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-white/85 hover:text-white"
                >
                  Google Scholar profile <ExternalArrow />
                </a>
              )}
            </div>
            <div className="p-8 md:p-12 lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/45">{label}</dt>
      <dd className="mt-1.5 text-[0.95rem]">{children}</dd>
    </div>
  );
}

function initials(name: string) {
  return name
    .replace(/^(dr|prof)\.?\s*/i, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
