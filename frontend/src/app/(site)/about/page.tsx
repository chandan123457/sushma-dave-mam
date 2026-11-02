import type { Metadata } from "next";
import { getAwards, getProfile, getPublications } from "@/lib/data";
import { Reveal } from "@/components/site/motion";
import { ExternalArrow } from "@/components/site/nav";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, awards, pubs] = await Promise.all([getProfile(), getAwards(), getPublications()]);
  const counts = [
    [pubs.filter((p) => p.type === "journal").length, "Journal articles"],
    [pubs.filter((p) => p.type === "chapter").length, "Book chapters"],
    [pubs.filter((p) => p.type === "book").length, "Books"],
  ] as const;

  return (
    <>
      <header className="relative overflow-hidden border-b border-hairline bg-subtle pt-[72px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_90%_0%,var(--brand-soft),transparent_70%)]" />
        <div className="site-container relative grid items-center gap-10 py-14 md:grid-cols-12 md:py-20">
          <Reveal className="md:col-span-8">
            <p className="eyebrow">About</p>
            <h1 className="h-display mt-3 text-[clamp(2.4rem,5vw,3.75rem)] text-fg">
              {profile.honorific} {profile.name}
            </h1>
            <p className="mt-4 text-[1.1rem] text-fg-muted">
              {profile.designation}, {profile.department}
              <br />
              {profile.institution}, {profile.location}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="site-container grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-[100px]">
            <div className="overflow-hidden rounded-2xl border border-hairline bg-subtle-2">
              {profile.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoUrl} alt={`${profile.honorific} ${profile.name}`} className="aspect-[4/5] w-full object-cover object-top" />
              )}
            </div>
            <div className="rounded-2xl border border-hairline bg-white p-6">
              <h2 className="font-heading text-[0.95rem] font-bold text-fg">Contact</h2>
              <dl className="mt-4 space-y-3 text-[0.9rem]">
                <div>
                  <dt className="text-fg-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`} className="break-all font-medium text-brand hover:underline">
                      {profile.email}
                    </a>
                  </dd>
                  {profile.altEmail && (
                    <dd>
                      <a href={`mailto:${profile.altEmail}`} className="break-all font-medium text-brand hover:underline">
                        {profile.altEmail}
                      </a>
                    </dd>
                  )}
                </div>
                <div>
                  <dt className="text-fg-muted">Location</dt>
                  <dd className="font-medium text-fg">{profile.location}</dd>
                </div>
              </dl>
              <div className="mt-5 space-y-1 border-t border-hairline pt-4">
                {profile.cvUrl && <SideLink href={profile.cvUrl}>Curriculum vitae (PDF)</SideLink>}
                {profile.scholarUrl && <SideLink href={profile.scholarUrl}>Google Scholar</SideLink>}
                {profile.institutionUrl && <SideLink href={profile.institutionUrl}>JIET faculty page</SideLink>}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <Section title="Biography">
            <p className="text-[1.15rem] font-medium leading-[1.7] text-fg">{profile.shortBio}</p>
            <div className="mt-6 space-y-5 text-[1.05rem] leading-[1.8] text-fg-2">
              {profile.bio.split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Section>

          <Section title="Publications at a glance">
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-hairline">
              {counts.map(([n, l], i) => (
                <div key={l} className={`bg-white p-5 md:p-6 ${i > 0 ? "border-l border-hairline" : ""}`}>
                  <p className="num text-[2.25rem] font-extrabold leading-none text-navy">{n}</p>
                  <p className="mt-2 text-[0.85rem] text-fg-muted">{l}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            <ol className="relative space-y-4 border-l border-hairline pl-6">
              {profile.education.map((e) => (
                <li key={e.degree} className="relative">
                  <span className="absolute -left-[29.5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand ring-1 ring-brand" />
                  <p className="num text-[0.85rem] font-bold text-brand">{e.year}</p>
                  <p className="mt-0.5 font-heading text-[1.05rem] font-bold text-fg">{e.degree}</p>
                  <p className="text-[0.92rem] text-fg-muted">{e.institution}</p>
                </li>
              ))}
            </ol>
          </Section>

          {profile.courses.length > 0 && (
            <Section title="Teaching">
              <ul className="grid gap-2 sm:grid-cols-2">
                {profile.courses.map((c) => (
                  <li key={c} className="flex items-center gap-3 rounded-xl border border-hairline bg-white px-4 py-3 text-[0.95rem] font-medium text-fg-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {c}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {awards.length > 0 && (
            <Section title="Recognition and service">
              <ul className="space-y-3">
                {awards.map((a) => (
                  <li key={a.id} className="rounded-xl border border-hairline bg-white p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-heading font-bold text-fg">{a.title}</p>
                      {a.year && <span className="num text-[0.85rem] font-semibold text-brand">{a.year}</span>}
                    </div>
                    {a.issuer && <p className="mt-0.5 text-[0.9rem] text-fg-muted">{a.issuer}</p>}
                    {a.description && <p className="mt-2 text-[0.92rem] leading-relaxed text-fg-2">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="border-b border-hairline py-10 first:pt-0 last:border-0">
      <h2 className="h-section mb-6 text-[1.6rem] text-fg">{title}</h2>
      {children}
    </Reveal>
  );
}

function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg px-2 py-2 text-[0.9rem] font-medium text-fg-2 hover:bg-subtle hover:text-brand">
      {children}
      <ExternalArrow />
    </a>
  );
}
