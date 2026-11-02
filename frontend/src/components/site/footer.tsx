import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Arrow } from "./nav";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date(profile.updatedAt).getFullYear();
  return (
    <footer className="bg-night text-paper">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] tracking-tight">
              {profile.honorific} {profile.name}
            </p>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-paper/60">
              {profile.designation}, {profile.department}. {profile.institution}, {profile.location}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
            <FooterCol title="Site">
              <FooterLink href="/research">Research</FooterLink>
              <FooterLink href="/publications">Publications</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/#contact">Contact</FooterLink>
            </FooterCol>
            <FooterCol title="Elsewhere">
              {profile.scholarUrl && <FooterLink href={profile.scholarUrl} external>Google Scholar</FooterLink>}
              {profile.institutionUrl && <FooterLink href={profile.institutionUrl} external>JIET profile</FooterLink>}
            </FooterCol>
            <FooterCol title="Write">
              <a href={`mailto:${profile.email}`} className="break-all text-[0.9rem] text-paper/80 hover:text-paper">
                {profile.email}
              </a>
            </FooterCol>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/10 pt-6 text-[0.75rem] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">© {year} {profile.name}</p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Citation metrics via Google Scholar
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label !text-paper/40">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "group inline-flex items-center gap-1.5 text-[0.9rem] text-paper/80 transition-colors hover:text-paper";
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {children}
          <Arrow className="opacity-40 transition-opacity group-hover:opacity-100" />
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
