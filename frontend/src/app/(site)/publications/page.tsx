import type { Metadata } from "next";
import { getProfile, getPublications } from "@/lib/data";
import { nf } from "@/lib/format";
import { PublicationBrowser } from "@/components/site/publication-browser";
import { Reveal, RiseText } from "@/components/site/motion";

export const metadata: Metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [profile, pubs] = await Promise.all([getProfile(), getPublications()]);
  const total = pubs.reduce((sum, p) => sum + p.citations, 0);
  const years = pubs.map((p) => p.year).filter((y): y is number => !!y);

  return (
    <div className="container-x pb-28 pt-32 md:pt-44">
      <header className="grid gap-10 pb-16 md:grid-cols-12 md:pb-20">
        <div className="md:col-span-8">
          <p className="label">Bibliography · {Math.min(...years)}–{Math.max(...years)}</p>
          <h1 className="display mt-6 text-[clamp(3.2rem,9vw,8rem)]">
            <RiseText text="Publications" />
          </h1>
        </div>
        <Reveal delay={0.3} className="flex flex-col justify-end gap-6 md:col-span-4">
          <p className="text-[1.05rem] leading-relaxed text-ink-2">
            Journal articles, edited books and chapters by {profile.honorific} {profile.name} and collaborators — {nf.format(total)} citations
            across {pubs.length} works.
          </p>
        </Reveal>
      </header>
      <PublicationBrowser publications={pubs} />
    </div>
  );
}
