"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/admin-api";
import { PageHeader, Spinner } from "@/components/admin/ui";

type Overview = {
  publications: number;
  news: number;
  media: number;
  unreadMessages: number;
  citations: number;
  latest: { id: number; title: string; year: number | null; updatedAt: string }[];
};

const QUICK = [
  { href: "/admin/publications", title: "Add a publication", body: "Paper, chapter or book — with abstract, PDF and DOI." },
  { href: "/admin/profile", title: "Update profile", body: "Bio, portrait, metrics and contact details." },
  { href: "/admin/news", title: "Post news", body: "Awards, talks, new books and announcements." },
  { href: "/admin/media", title: "Upload files", body: "PDFs, CV and images for use anywhere on the site." },
];

export default function Dashboard() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    api.get<Overview>("/admin/overview").then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex items-center gap-2 py-20 text-sm text-muted">
        <Spinner /> Loading overview
      </div>
    );
  }

  const stats = [
    { label: "Publications", value: data.publications, href: "/admin/publications" },
    { label: "Citations (listed)", value: data.citations.toLocaleString("en-IN"), href: "/admin/publications" },
    { label: "Unread messages", value: data.unreadMessages, href: "/admin/messages", hot: data.unreadMessages > 0 },
    { label: "Files", value: data.media, href: "/admin/media" },
  ];

  return (
    <div>
      <PageHeader title="Good to see you." description="Everything on the public website is managed from here. Changes go live as soon as you save." />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group bg-paper p-6 transition-colors hover:bg-paper-2/70">
            <p className="label flex items-center gap-2">
              {s.hot && <span className="h-1.5 w-1.5 rounded-full bg-copper" />}
              {s.label}
            </p>
            <p className="mt-4 font-serif text-5xl leading-none">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="label mb-4">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK.map((q) => (
              <Link key={q.href} href={q.href} className="group rounded-xl border border-line bg-white/50 p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink/40">
                <p className="flex items-center justify-between font-medium">
                  {q.title}
                  <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">{q.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="label mb-4">Recently edited</h2>
          <ul className="overflow-hidden rounded-xl border border-line bg-white/50">
            {data.latest.map((p) => (
              <li key={p.id} className="border-b border-line/70 px-5 py-3.5 last:border-0">
                <p className="line-clamp-1 text-[0.86rem]">{p.title}</p>
                <p className="mt-0.5 font-mono text-[0.7rem] text-muted">
                  {p.year ?? "—"} · edited {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
