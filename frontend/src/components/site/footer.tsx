import Link from "next/link";
import type { Profile } from "@/lib/types";
import { ExternalArrow } from "./nav";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date(profile.updatedAt).getFullYear();
  return (
    <footer className="bg-navy text-white">
      <div className="site-container py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-heading text-base font-bold text-navy">SD</span>
              <div>
                <p className="font-heading text-lg font-bold">
                  {profile.honorific} {profile.name}
                </p>
                <p className="text-sm text-white/60">{profile.designation}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[0.9rem] leading-relaxed text-white/60">
              {profile.department}, {profile.institution}, {profile.location}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <Col title="Navigate">
              <FLink href="/">Home</FLink>
              <FLink href="/research">Research</FLink>
              <FLink href="/publications">Publications</FLink>
              <FLink href="/about">About</FLink>
            </Col>
            <Col title="Profiles">
              {profile.scholarUrl && <FLink href={profile.scholarUrl} external>Google Scholar</FLink>}
              {profile.institutionUrl && <FLink href={profile.institutionUrl} external>JIET Faculty Page</FLink>}
            </Col>
            <Col title="Contact">
              <li>
                <a href={`mailto:${profile.email}`} className="break-all text-[0.9rem] text-white/80 hover:text-white">
                  {profile.email}
                </a>
              </li>
              {profile.altEmail && (
                <li>
                  <a href={`mailto:${profile.altEmail}`} className="break-all text-[0.9rem] text-white/80 hover:text-white">
                    {profile.altEmail}
                  </a>
                </li>
              )}
            </Col>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.8rem] text-white/45 sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.honorific} {profile.name}. All rights reserved.
          </p>
          <p>Citation metrics sourced from Google Scholar.</p>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-heading text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white/45">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "inline-flex items-center gap-1.5 text-[0.9rem] text-white/80 transition-colors hover:text-white";
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {children}
          <ExternalArrow className="opacity-60" />
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
