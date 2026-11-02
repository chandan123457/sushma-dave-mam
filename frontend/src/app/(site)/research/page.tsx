import type { Metadata } from "next";
import { getProjects, getPublications, getResearch } from "@/lib/data";
import type { Publication, ResearchArea } from "@/lib/types";
import { PublicationRow } from "@/components/site/blocks";
import { Reveal, RiseText } from "@/components/site/motion";

export const metadata: Metadata = { title: "Research" };

/** Papers whose title shares a keyword with the research area. */
function papersFor(area: ResearchArea, pubs: Publication[]) {
  const keys = area.keywords.map((k) => k.toLowerCase());
  return pubs
    .filter((p) => keys.some((k) => p.title.toLowerCase().includes(k)))
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 3);
}

export default async function ResearchPage() {
  const [areas, pubs, projects] = await Promise.all([getResearch(), getPublications(), getProjects()]);

  return (
    <div className="pb-28 pt-32 md:pt-44">
      <header className="container-x grid gap-10 pb-20 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="label">Research programme</p>
          <h1 className="display mt-6 text-[clamp(3.2rem,9vw,8rem)]">
            <RiseText text="Research" />
          </h1>
        </div>
        <Reveal delay={0.3} className="flex items-end md:col-span-4">
          <p className="text-[1.05rem] leading-relaxed text-ink-2">
            {areas.length} connected lines of inquiry — from the electrode surface to the clinic and the river.
          </p>
        </Reveal>
      </header>

      {/* Index */}
      <nav className="container-x" aria-label="Research areas">
        <ol className="grid border-t border-line-strong sm:grid-cols-2 lg:grid-cols-5">
          {areas.map((a, i) => (
            <li key={a.id} className="border-b border-line lg:border-b-0 lg:border-r lg:last:border-r-0">
              <a href={`#area-${a.id}`} className="group flex h-full flex-col gap-6 p-5 transition-colors hover:bg-paper-2">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-xl leading-tight group-hover:text-accent">{a.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {areas.map((area, i) => {
        const papers = papersFor(area, pubs);
        return (
          <section key={area.id} id={`area-${area.id}`} className="container-x scroll-mt-24 pt-24 md:pt-32">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="md:sticky md:top-28">
                  <p className="font-serif text-[7rem] leading-none text-paper-3 md:text-[9rem]">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="display -mt-6 text-[clamp(2.2rem,4vw,3.4rem)] md:-mt-10">{area.title}</h2>
                  {papers.length > 0 && (
                    <p className="label mt-6">
                      {papers.length} key paper{papers.length > 1 ? "s" : ""} below
                    </p>
                  )}
                </div>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <Reveal>
                  <p className="font-serif text-[1.65rem] leading-[1.3] tracking-[-0.01em] text-ink">{area.summary}</p>
                </Reveal>
                {area.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={area.imageUrl} alt="" className="mt-10 aspect-[16/9] w-full object-cover" />
                )}
                {area.description && (
                  <div className="prose-body mt-8 text-[1.05rem] leading-[1.75] text-ink-2">
                    {area.description.split(/\n{2,}/).map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                )}
                {papers.length > 0 && (
                  <div className="mt-12">
                    <p className="label">Key papers</p>
                    <div className="mt-3 border-b border-line">
                      {papers.map((p) => (
                        <PublicationRow key={p.id} pub={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {projects.length > 0 && (
        <section className="container-x pt-28 md:pt-40">
          <div className="grid gap-6 border-t border-line-strong pt-6 md:grid-cols-12">
            <p className="label md:col-span-3">Funded work</p>
            <h2 className="display text-[clamp(2.2rem,4.6vw,4rem)] md:col-span-9">Projects</h2>
          </div>
          <ul className="mt-12">
            {projects.map((p) => (
              <li key={p.id} className="grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <span
                    className={`inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] ${p.status === "ongoing" ? "text-accent" : "text-muted"}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${p.status === "ongoing" ? "bg-accent" : "bg-faint"}`} />
                    {p.status}
                  </span>
                  {p.period && <p className="mt-2 font-mono text-[0.75rem] text-muted">{p.period}</p>}
                </div>
                <div className="md:col-span-6">
                  <p className="font-serif text-[1.6rem] leading-tight">{p.title}</p>
                  {p.description && <p className="mt-3 leading-relaxed text-ink-2">{p.description}</p>}
                </div>
                <dl className="space-y-1 text-[0.85rem] md:col-span-3 md:text-right">
                  {p.funder && <dd className="text-ink">{p.funder}</dd>}
                  {p.amount && <dd className="font-mono text-muted">{p.amount}</dd>}
                  {p.role && <dd className="text-muted">{p.role}</dd>}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
