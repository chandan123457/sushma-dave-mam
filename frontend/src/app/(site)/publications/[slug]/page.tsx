import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublication, getPublications } from "@/lib/data";
import { doiUrl, nf } from "@/lib/format";
import { TYPE_LABEL, type Publication } from "@/lib/types";
import { Authors, PublicationRow } from "@/components/site/blocks";
import { Reveal } from "@/components/site/motion";
import { Arrow } from "@/components/site/nav";
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
    <Suspense fallback={<div className="container-x min-h-[70vh] pt-44" />}>
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
    .slice(0, 3);

  const meta: [string, React.ReactNode][] = [
    ["Type", TYPE_LABEL[pub.type]],
    ["Published", pub.publishedOn ?? pub.year ?? "—"],
    ["In", <em key="v">{pub.venue || "—"}</em>],
    ...(pub.publisher ? [["Publisher", pub.publisher] as [string, React.ReactNode]] : []),
    ...(pub.volume ? [["Volume", `${pub.volume}${pub.issue ? ` (${pub.issue})` : ""}`] as [string, React.ReactNode]] : []),
    ...(pub.pages ? [["Pages", pub.pages] as [string, React.ReactNode]] : []),
    ["Citations", pub.citations ? nf.format(pub.citations) : "—"],
  ];

  return (
    <article className="pb-24 pt-28 md:pt-40">
      <div className="container-x">
        <Link href="/publications" className="group label inline-flex items-center gap-2 hover:text-ink">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All publications
        </Link>

        <div className="mt-10 grid gap-12 md:grid-cols-12">
          <header className="md:col-span-9">
            <Reveal>
              <p className="label">
                {TYPE_LABEL[pub.type]} {pub.year && <>· {pub.year}</>}
              </p>
              <h1 className="mt-6 font-serif text-[clamp(2.2rem,4.8vw,4.4rem)] leading-[1.04] tracking-[-0.02em]">{pub.title}</h1>
              <Authors authors={pub.authors} className="mt-8 max-w-3xl text-[1.02rem] leading-relaxed text-ink-2" />
            </Reveal>
          </header>
        </div>

        <div className="mt-16 grid gap-12 border-t border-line-strong pt-10 md:grid-cols-12">
          <aside className="md:col-span-4 lg:col-span-3">
            <dl className="divide-y divide-line border-y border-line">
              {meta.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[96px_1fr] gap-4 py-3.5">
                  <dt className="label pt-0.5">{k}</dt>
                  <dd className="text-[0.9rem] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-col gap-3">
              {pub.pdfUrl && <ActionLink href={pub.pdfUrl} primary>Download PDF</ActionLink>}
              {pub.doi && <ActionLink href={doiUrl(pub.doi)}>DOI · {pub.doi}</ActionLink>}
              {pub.url && <ActionLink href={pub.url}>View at publisher</ActionLink>}
              <CopyCitation text={citationText(pub)} />
            </div>
          </aside>

          <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
            <p className="label">Abstract</p>
            {pub.abstract ? (
              <div className="prose-body mt-6 text-[1.12rem] leading-[1.75] text-ink-2 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-ink">
                {pub.abstract.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-[1.05rem] leading-relaxed text-muted">
                An abstract has not been added for this work yet. {pub.url || pub.doi ? "The full record is available from the publisher." : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-28">
          <p className="label border-t border-line-strong pt-6">More {TYPE_LABEL[pub.type].toLowerCase()}s</p>
          <div className="mt-6 border-b border-line">
            {related.map((p) => (
              <PublicationRow key={p.id} pub={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function ActionLink({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        primary
          ? "group flex items-center justify-between rounded-full bg-ink px-5 py-3 text-[0.85rem] text-paper"
          : "group flex items-center justify-between gap-3 rounded-full border border-line-strong px-5 py-3 text-[0.85rem] transition-colors hover:border-ink"
      }
    >
      <span className="truncate">{children}</span>
      <Arrow className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
