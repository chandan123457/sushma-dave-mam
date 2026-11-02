import type { Metadata } from "next";
import { getProjects, getPublications, getResearch } from "@/lib/data";
import type { Publication, ResearchArea } from "@/lib/types";
import { PublicationCard } from "@/components/site/blocks";
import { Reveal } from "@/components/site/motion";
import { PageHeader } from "@/components/site/page-header";
import { ResearchIcon } from "@/components/site/icons";

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
    <>
      <PageHeader
        eyebrow="Research"
        title="Research areas"
        description="Electrochemistry and materials chemistry applied to diagnostics, drug discovery and environmental remediation."
      >
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Research areas">
          {areas.map((a) => (
            <a
              key={a.id}
              href={`#area-${a.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-3 py-2 text-[0.85rem] font-medium text-fg-2 transition-colors hover:border-brand-tint hover:text-brand"
            >
              <ResearchIcon title={a.title} className="h-4 w-4 text-brand" />
              {a.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="site-container divide-y divide-hairline">
        {areas.map((area) => {
          const papers = papersFor(area, pubs);
          return (
            <section key={area.id} id={`area-${area.id}`} className="grid scroll-mt-24 gap-10 py-16 md:py-20 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-[100px]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <ResearchIcon title={area.title} className="h-7 w-7" />
                  </span>
                  <h2 className="h-section mt-6 text-[clamp(1.6rem,2.6vw,2.1rem)] text-fg">{area.title}</h2>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-fg-muted">{area.summary}</p>
                </div>
              </div>
              <div className="lg:col-span-8">
                {area.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={area.imageUrl} alt="" className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover" />
                )}
                {area.description && (
                  <Reveal className="space-y-5 text-[1.05rem] leading-[1.8] text-fg-2">
                    {area.description.split(/\n{2,}/).map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </Reveal>
                )}
                {papers.length > 0 && (
                  <div className="mt-10">
                    <h3 className="font-heading text-[0.95rem] font-bold text-fg">Key publications</h3>
                    <div className="mt-4 space-y-3">
                      {papers.map((p) => (
                        <PublicationCard key={p.id} pub={p} compact />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {projects.length > 0 && (
        <section className="border-t border-hairline bg-subtle py-16 md:py-24">
          <div className="site-container">
            <p className="eyebrow">Funding</p>
            <h2 className="h-section mt-3 text-[clamp(1.9rem,3.4vw,2.75rem)] text-fg">Research projects</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {projects.map((p) => (
                <article key={p.id} className="flex flex-col rounded-2xl border border-hairline bg-white p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.75rem] font-semibold capitalize ${p.status === "ongoing" ? "bg-[#ecfdf3] text-[#067647]" : "bg-subtle-2 text-fg-muted"}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${p.status === "ongoing" ? "bg-[#17b26a]" : "bg-fg-faint"}`} />
                      {p.status}
                    </span>
                    {p.period && <span className="text-[0.85rem] text-fg-muted">{p.period}</span>}
                  </div>
                  <h3 className="mt-4 font-heading text-[1.15rem] font-bold leading-snug text-fg">{p.title}</h3>
                  {p.description && <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-fg-muted">{p.description}</p>}
                  {(p.funder || p.amount || p.role) && (
                    <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-hairline pt-5 text-[0.88rem] sm:grid-cols-3">
                      {p.funder && <Meta k="Funded by" v={p.funder} />}
                      {p.amount && <Meta k="Amount" v={p.amount} />}
                      {p.role && <Meta k="Role" v={p.role} />}
                    </dl>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-fg-muted">{k}</dt>
      <dd className="mt-0.5 font-medium text-fg">{v}</dd>
    </div>
  );
}
