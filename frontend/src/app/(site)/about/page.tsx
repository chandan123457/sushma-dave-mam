import type { Metadata } from "next";
import { getAwards, getProfile, getPublications } from "@/lib/data";
import { Reveal, RiseText } from "@/components/site/motion";
import { Arrow } from "@/components/site/nav";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, awards, pubs] = await Promise.all([getProfile(), getAwards(), getPublications()]);
  const counts = {
    journal: pubs.filter((p) => p.type === "journal").length,
    chapter: pubs.filter((p) => p.type === "chapter").length,
    book: pubs.filter((p) => p.type === "book").length,
  };

  return (
    <div className="pb-28 pt-32 md:pt-44">
      <header className="container-x">
        <p className="label">About</p>
        <h1 className="display mt-6 text-[clamp(3.2rem,9vw,8rem)]">
          <RiseText text={`${profile.honorific} ${profile.name}`} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-6 text-[1.1rem] text-ink-2">
            {profile.designation} · {profile.department} · {profile.institution}
          </p>
        </Reveal>
      </header>

      <section className="container-x mt-20 grid gap-12 md:mt-28 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <figure className="md:sticky md:top-28">
            <div className="aspect-[4/5] overflow-hidden bg-paper-3">
              {profile.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoUrl} alt={profile.name} className="h-full w-full object-cover object-top grayscale mix-blend-multiply" />
              )}
            </div>
            <dl className="mt-6 divide-y divide-line border-y border-line text-[0.88rem]">
              <Row k="Email">
                <a href={`mailto:${profile.email}`} className="break-all hover:underline">{profile.email}</a>
              </Row>
              {profile.altEmail && (
                <Row k="Alt.">
                  <a href={`mailto:${profile.altEmail}`} className="break-all hover:underline">{profile.altEmail}</a>
                </Row>
              )}
              <Row k="Based">{profile.location}</Row>
            </dl>
            <div className="mt-6 flex flex-col gap-2">
              {profile.cvUrl && <OutLink href={profile.cvUrl}>Curriculum vitae (PDF)</OutLink>}
              {profile.scholarUrl && <OutLink href={profile.scholarUrl}>Google Scholar</OutLink>}
              {profile.institutionUrl && <OutLink href={profile.institutionUrl}>Faculty page, JIET</OutLink>}
            </div>
          </figure>
        </Reveal>

        <div className="md:col-span-7 md:col-start-6">
          <Reveal>
            <p className="font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.25] tracking-[-0.01em]">{profile.shortBio}</p>
          </Reveal>
          <div className="prose-body mt-10 text-[1.08rem] leading-[1.8] text-ink-2">
            {profile.bio.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Block title="Education">
            <ol className="relative">
              {profile.education.map((e) => (
                <li key={e.degree} className="grid grid-cols-[88px_1fr] gap-6 border-t border-line py-5">
                  <span className="font-mono text-[0.8rem] text-muted">{e.year}</span>
                  <div>
                    <p className="font-medium">{e.degree}</p>
                    <p className="text-[0.92rem] text-muted">{e.institution}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Output at a glance">
            <div className="grid grid-cols-3 border-t border-line">
              {[
                [counts.journal, "Journal articles"],
                [counts.chapter, "Book chapters"],
                [counts.book, "Books"],
              ].map(([n, l], i) => (
                <div key={l} className={`py-6 ${i > 0 ? "border-l border-line pl-6" : ""}`}>
                  <p className="font-serif text-5xl leading-none">{n}</p>
                  <p className="label mt-3">{l}</p>
                </div>
              ))}
            </div>
          </Block>

          {profile.courses.length > 0 && (
            <Block title="Teaching">
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {profile.courses.map((c) => (
                  <li key={c} className="flex items-baseline gap-3 border-t border-line py-3.5">
                    <span className="h-1 w-1 translate-y-[-3px] rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {awards.length > 0 && (
            <Block title="Recognition & service">
              <ul>
                {awards.map((a) => (
                  <li key={a.id} className="grid grid-cols-[88px_1fr] gap-6 border-t border-line py-5">
                    <span className="font-mono text-[0.8rem] text-muted">{a.year ?? "—"}</span>
                    <div>
                      <p className="font-medium">{a.title}</p>
                      {a.issuer && <p className="text-[0.92rem] text-muted">{a.issuer}</p>}
                      {a.description && <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{a.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <h2 className="display mb-6 text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-4 py-3">
      <dt className="label pt-0.5">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-line py-2.5 text-[0.9rem] hover:text-accent">
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
