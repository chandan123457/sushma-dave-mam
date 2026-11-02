import Link from "next/link";
import { getCollaborators, getNews, getProfile, getPublications, getResearch } from "@/lib/data";
import { formatDate, nf } from "@/lib/format";
import { CitationChart, PublicationRow, SectionHead, TextLink } from "@/components/site/blocks";
import { CountUp, Reveal, RiseText } from "@/components/site/motion";
import { Voltammogram } from "@/components/site/voltammogram";
import { ContactForm } from "@/components/site/contact-form";
import { Arrow } from "@/components/site/nav";

// Deep cloth-binding tones for typographic book covers.
const COVER_TONES = ["#1d4a42", "#5a2a19", "#23262e", "#2e3b2a", "#3a2335", "#1c2f44", "#4a3a1e", "#2b2b2b"];

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
  const firstYear = Math.min(...pubs.map((p) => p.year ?? 9999));
  const s = profile.stats;

  const metrics = [
    { value: s.citations.all, label: "Citations", note: `${nf.format(s.citations.recent)} since ${s.recentSince}` },
    { value: s.hIndex.all, label: "h-index", note: `${s.hIndex.recent} since ${s.recentSince}` },
    { value: s.i10Index.all, label: "i10-index", note: `${s.i10Index.recent} since ${s.recentSince}` },
    { value: pubs.length, label: "Publications", note: `Indexed since ${firstYear}` },
  ];

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
        <Voltammogram className="pointer-events-none absolute -right-24 top-36 hidden w-[720px] text-ink [mask-image:linear-gradient(to_right,transparent_8%,black_42%,black_80%,transparent)] lg:block xl:right-0" />

        <div className="container-x relative">
          <Reveal>
            <p className="label flex items-start gap-3">
              <span className="mt-[0.4em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>
                {profile.designation} · {profile.institution}
              </span>
            </p>
          </Reveal>

          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="display text-[clamp(3.6rem,11vw,9.5rem)]">
                <RiseText text={profile.honorific} className="block italic text-muted [font-size:0.42em] leading-none" />
                <RiseText text={profile.name} delay={0.12} />
              </h1>

              <Reveal delay={0.5}>
                <p className="mt-10 max-w-[34rem] text-[1.15rem] leading-[1.6] text-ink-2 md:text-[1.25rem]">
                  {profile.tagline}
                </p>
              </Reveal>

              <Reveal delay={0.65}>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href="/publications"
                    className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[0.9rem] text-paper transition-transform active:scale-[0.98]"
                  >
                    Read the publications
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                  <TextLink href="/research">Research programme</TextLink>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="lg:col-span-4 lg:col-start-9 lg:mt-24">
              <figure className="relative mx-auto max-w-[360px] lg:max-w-none">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-3">
                  {profile.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.photoUrl}
                      alt={`Portrait of ${profile.honorific} ${profile.name}`}
                      className="h-full w-full object-cover object-top grayscale contrast-[1.05] mix-blend-multiply"
                      fetchPriority="high"
                    />
                  )}
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="label">Fig. 01</span>
                  <span className="label text-right">{profile.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Interests as a quiet running index */}
          <Reveal delay={0.8}>
            <ul className="mt-20 flex flex-wrap gap-x-2 gap-y-2 md:mt-24">
              {profile.interests.map((interest) => (
                <li key={interest} className="rounded-full border border-line-strong px-4 py-1.5 text-[0.8rem] text-ink-2">
                  {interest}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── Metrics ───────────────────────── */}
      <section className="border-y border-line-strong">
        <div className="container-x grid grid-cols-2 md:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`py-8 md:py-10 ${i % 2 === 1 ? "pl-6 md:pl-8" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i % 2 === 1 ? "border-l border-line" : ""}`}
            >
              <p className="label">{m.label}</p>
              <p className="mt-3 font-serif text-[clamp(2.75rem,6vw,4.75rem)] leading-none tracking-tight">
                <CountUp value={m.value} />
              </p>
              <p className="mt-2 font-mono text-[0.7rem] text-muted">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── About / Bio ───────────────────────── */}
      <section className="container-x py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="label md:col-span-3">
            <span className="text-ink">00</span>&nbsp;&nbsp;&nbsp;&nbsp;Profile
          </p>
          <div className="md:col-span-8">
            <Reveal>
              <p className="font-serif text-[clamp(1.7rem,3.2vw,2.75rem)] leading-[1.18] tracking-[-0.015em] text-ink">
                {profile.shortBio}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
                {profile.education.map((e) => (
                  <div key={e.degree}>
                    <p className="font-mono text-[0.75rem] text-muted">{e.year}</p>
                    <p className="mt-2 font-medium">{e.degree}</p>
                    <p className="text-[0.9rem] text-muted">{e.institution}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <TextLink href="/about" className="mt-10">
                Full profile
              </TextLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Research ───────────────────────── */}
      <section className="container-x pb-24 md:pb-36">
        <SectionHead index="01" label="Research" title={<>Questions at the electrode, <em className="text-accent">and beyond it.</em></>} aside={<TextLink href="/research">All areas</TextLink>} />
        <ol className="mt-14">
          {research.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.05}>
              <Link
                href={`/research#area-${r.id}`}
                className="group grid gap-4 border-t border-line py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="label pt-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.05] tracking-tight transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-accent md:col-span-5">
                  {r.title}
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-ink-2 md:col-span-5 md:pt-2">{r.summary}</p>
                <span className="hidden justify-end pt-3 md:col-span-1 md:flex">
                  <Arrow className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ───────────────────────── Selected publications ───────────────────────── */}
      <section className="bg-paper-2/70 py-24 md:py-36">
        <div className="container-x">
          <SectionHead
            index="02"
            label="Selected work"
            title={<>Most-cited <em>publications</em></>}
            aside={<TextLink href="/publications">All {pubs.length}</TextLink>}
          />
          <div className="mt-14 border-b border-line">
            {selected.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <PublicationRow pub={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Citations over time ───────────────────────── */}
      <section className="container-x py-24 md:py-36">
        <SectionHead index="03" label="Reach" title={<>A body of work that keeps <em>being read.</em></>} />
        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="font-serif text-6xl leading-none tracking-tight">
              <CountUp value={s.citations.recent} />
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              citations since {s.recentSince} — {Math.round((s.citations.recent / Math.max(s.citations.all, 1)) * 100)}% of the
              all-time total, a sign of how current the work remains.
            </p>
          </div>
          <div className="pl-8 md:col-span-9">
            <CitationChart data={profile.citationsByYear} />
            <p className="label mt-6 text-right">Citations per year · Google Scholar</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Books ───────────────────────── */}
      {books.length > 0 && (
        <section className="bg-night py-24 text-paper md:py-36">
          <div className="container-x">
            <div className="grid gap-6 border-t border-paper/25 pt-6 md:grid-cols-12">
              <p className="label flex gap-4 !text-paper/50 md:col-span-3">
                <span className="text-paper">04</span>
                <span>Books</span>
              </p>
              <Reveal className="md:col-span-9">
                <h2 className="display text-[clamp(2.25rem,4.6vw,4rem)]">
                  Edited volumes <em className="text-paper/60">&amp; monographs</em>
                </h2>
              </Reveal>
            </div>
          </div>
          <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)] pb-6 [scrollbar-width:none] xl:px-[max(3rem,calc((100vw-1320px)/2+3rem))] [&::-webkit-scrollbar]:hidden">
              {books.map((b, i) => (
                <Reveal key={b.id} delay={Math.min(i, 4) * 0.08} className="w-[240px] shrink-0 snap-start sm:w-[260px]">
                  <Link href={`/publications/${b.slug}`} className="group block">
                    <div
                      className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] ring-1 ring-paper/10 transition-[transform,box-shadow] duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:ring-paper/30"
                      style={{ backgroundColor: COVER_TONES[i % COVER_TONES.length] }}
                    >
                      {b.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <>
                          <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
                          <p className="label !text-paper/40">{b.publisher ?? "Book"}</p>
                          <p className="font-serif text-[1.55rem] leading-[1.1]">{b.title}</p>
                          <p className="font-mono text-[0.7rem] text-paper/50">{b.year}</p>
                        </>
                      )}
                    </div>
                    <p className="mt-4 line-clamp-2 text-[0.85rem] text-paper/60">{b.authors}</p>
                  </Link>
                </Reveal>
              ))}
          </div>
          <p className="container-x label !text-paper/40">{books.length} volumes · scroll →</p>
        </section>
      )}

      {/* ───────────────────────── News ───────────────────────── */}
      {news.length > 0 && (
        <section className="container-x py-24 md:py-36">
          <SectionHead index="05" label="Notes" title={<>Recent <em>news</em></>} />
          <ul className="mt-14">
            {news.slice(0, 5).map((n, i) => (
              <Reveal as="li" key={n.id} delay={i * 0.05} className="grid gap-2 border-t border-line py-7 md:grid-cols-12 md:gap-8">
                <time className="font-mono text-[0.75rem] text-muted md:col-span-3" dateTime={n.date}>
                  {/* A 1 January date means only the year is known. */}
                  {n.date.endsWith("-01-01") ? n.date.slice(0, 4) : formatDate(n.date, { month: "long", year: "numeric" })}
                </time>
                <div className="md:col-span-8">
                  <p className="font-serif text-[1.6rem] leading-tight">
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noreferrer" className="link-draw">
                        {n.title}
                      </a>
                    ) : (
                      n.title
                    )}
                  </p>
                  {n.body && <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-2">{n.body}</p>}
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* ───────────────────────── Collaborators ───────────────────────── */}
      {collaborators.length > 0 && (
        <section className="container-x pb-24 md:pb-36">
          <SectionHead index="06" label="Network" title={<>Co-authors &amp; <em>collaborators</em></>} />
          <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {collaborators.map((c) => (
              <li key={c.id} className="border-b border-r border-line p-6 transition-colors hover:bg-paper-2">
                <p className="font-medium">{c.name}</p>
                {c.affiliation && <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{c.affiliation}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ───────────────────────── Contact ───────────────────────── */}
      <section id="contact" className="scroll-mt-16 bg-accent text-paper">
        <div className="container-x grid gap-16 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-5">
            <p className="label !text-paper/60">07&nbsp;&nbsp;&nbsp;&nbsp;Contact</p>
            <h2 className="display mt-6 text-[clamp(2.8rem,6vw,5.5rem)]">
              Let’s talk <em>science.</em>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-paper/70">
              For research collaborations, doctoral supervision, invited lectures or book projects — write directly.
            </p>
            <div className="mt-10 space-y-2">
              <a href={`mailto:${profile.email}`} className="block font-serif text-2xl hover:underline hover:underline-offset-4">
                {profile.email}
              </a>
              {profile.altEmail && (
                <a href={`mailto:${profile.altEmail}`} className="block text-paper/70 hover:text-paper">
                  {profile.altEmail}
                </a>
              )}
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
