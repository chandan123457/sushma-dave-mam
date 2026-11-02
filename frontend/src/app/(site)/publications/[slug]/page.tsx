import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublication, getPublications } from "@/lib/data";
import { doiUrl, nf } from "@/lib/format";
import { TYPE_LABEL, type Publication } from "@/lib/types";
import { Authors, PublicationCard, TypeBadge } from "@/components/site/blocks";
import { Reveal } from "@/components/site/motion";
import { ExternalArrow } from "@/components/site/nav";
import { CopyCitation } from "@/components/site/copy-citation";

export async function generateStaticParams() {
  const pubs = await getPublications();
  return pubs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/publications/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pub = await getPublication(slug);
  return pub ? { title: pub.title, description: pub.abstract?.slice(0, 160) ?? pub.venue } : {};
}

export default function PublicationPage({ params }: PageProps<"/publications/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] pt-[72px]" />}>
      <PublicationDetail params={params} />
    </Suspense>
  );
}

function citationText(p: Publication) {
  const parts = [p.authors, p.year ? `(${p.year})` : null, `${p.title}.`, p.venue ? `${p.venue}.` : null, p.doi ? doiUrl(p.doi) : null];
  return parts.filter(Boolean).join(" ");
}

async function PublicationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pub, all] = await Promise.all([getPublication(slug), getPublications()]);
  if (!pub) notFound();

  const related = all
    .filter((p) => p.id !== pub.id && p.type === pub.type)
    .sort((a, b) => Math.abs((a.year ?? 0) - (pub.year ?? 0)) - Math.abs((b.year ?? 0) - (pub.year ?? 0)) || b.citations - a.citations)
    .slice(0, 4);

  const meta: [string, React.ReactNode][] = [
    ["Type", TYPE_LABEL[pub.type]],
    ["Published", pub.publishedOn ?? pub.year ?? "—"],
    ["Source", pub.venue || "—"],
    ...(pub.publisher ? [["Publisher", pub.publisher] as [string, React.ReactNode]] : []),
    ...(pub.volume ? [["Volume", `${pub.volume}${pub.issue ? ` (${pub.issue})` : ""}`] as [string, React.ReactNode]] : []),
    ...(pub.pages ? [["Pages", pub.pages] as [string, React.ReactNode]] : []),
    ["Citations", pub.citations ? nf.format(pub.citations) : "—"],
  ];

  return (
    <article>
      <header className="border-b border-hairline bg-subtle pt-[72px]">
        <div className="site-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-[0.85rem] text-fg-muted" aria-label="Breadcrumb">
            <Link href="/publications" className="font-medium hover:text-brand">
              Publications
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate">{TYPE_LABEL[pub.type]}</span>
          </nav>
          <Reveal className="max-w-4xl">
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <TypeBadge type={pub.type} />
              {pub.year && <span className="text-[0.85rem] font-medium text-fg-muted">{pub.year}</span>}
            </div>
            <h1 className="h-section mt-4 text-[clamp(1.8rem,3.6vw,2.75rem)] text-fg">{pub.title}</h1>
            <Authors authors={pub.authors} className="mt-5 text-[1rem] leading-relaxed text-fg-2" />
            {pub.venue && <p className="mt-2 text-[0.95rem] italic text-fg-muted">{pub.venue}</p>}
          </Reveal>
        </div>
      </header>

      <div className="site-container grid gap-10 py-12 md:py-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="h-section text-[1.35rem] text-fg">Abstract</h2>
          {pub.abstract ? (
            <div className="mt-5 space-y-5 text-[1.05rem] leading-[1.8] text-fg-2">
              {pub.abstract.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl border border-dashed border-hairline-strong bg-subtle p-5 text-[0.95rem] text-fg-muted">
              The abstract for this work is not yet available here.{" "}
              {pub.url || pub.doi ? "The full record can be read on the publisher’s website." : ""}
            </p>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-[100px]">
            <div className="rounded-2xl border border-hairline bg-white p-6">
              <h2 className="font-heading text-[0.95rem] font-bold text-fg">Details</h2>
              <dl className="mt-4 divide-y divide-hairline text-[0.9rem]">
                {meta.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-2.5">
                    <dt className="text-fg-muted">{k}</dt>
                    <dd className="font-medium text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col gap-2">
              {pub.pdfUrl && (
                <a href={pub.pdfUrl} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand text-[0.95rem] font-semibold text-white hover:bg-brand-hover">
                  Download PDF
                </a>
              )}
              {pub.doi && <OutLink href={doiUrl(pub.doi)}>View via DOI</OutLink>}
              {pub.url && <OutLink href={pub.url}>Publisher page</OutLink>}
              <CopyCitation text={citationText(pub)} />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-hairline bg-subtle py-14 md:py-20">
          <div className="site-container">
            <h2 className="h-section text-[1.6rem] text-fg">More {TYPE_LABEL[pub.type].toLowerCase()}s</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {related.map((p) => (
                <PublicationCard key={p.id} pub={p} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-white text-[0.92rem] font-semibold text-fg hover:border-fg-faint hover:bg-subtle"
    >
      {children}
      <ExternalArrow />
    </a>
  );
}
