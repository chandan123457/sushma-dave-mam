import type { Metadata } from "next";
import { getProfile, getPublications } from "@/lib/data";
import { nf } from "@/lib/format";
import { PublicationBrowser } from "@/components/site/publication-browser";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [profile, pubs] = await Promise.all([getProfile(), getPublications()]);
  const total = pubs.reduce((sum, p) => sum + p.citations, 0);
  const years = pubs.map((p) => p.year).filter((y): y is number => !!y);

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Publications"
        description={`Journal articles, book chapters and edited volumes by ${profile.honorific} ${profile.name} and collaborators.`}
      >
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            [pubs.length, "Publications"],
            [nf.format(total), "Citations"],
            [`${Math.min(...years)}–${Math.max(...years)}`, "Years"],
          ].map(([v, l]) => (
            <div key={l}>
              <dd className="num text-[1.75rem] font-extrabold text-navy">{v}</dd>
              <dt className="text-[0.85rem] text-fg-muted">{l}</dt>
            </div>
          ))}
        </dl>
      </PageHeader>
      <div className="site-container py-12 md:py-16">
        <PublicationBrowser publications={pubs} />
      </div>
    </>
  );
}
