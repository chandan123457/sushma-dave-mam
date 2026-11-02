"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import type { NewsItem } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function NewsAdmin() {
  return (
    <ResourceManager<NewsItem & Record<string, unknown>>
      endpoint="/admin/news"
      title="News"
      description="Announcements shown on the home page — new books, talks, awards, students."
      singular="news item"
      fields={[
        { name: "title", label: "Headline", type: "text", required: true },
        { name: "date", label: "Date", type: "date", span: 1, required: true },
        { name: "link", label: "Link", type: "url", span: 1, placeholder: "https://" },
        { name: "body", label: "Details", type: "textarea", rows: 4 },
        { name: "published", label: "Visible on site", type: "toggle" },
      ]}
      defaults={() => ({ date: new Date().toISOString().slice(0, 10), published: true })}
      search={(n) => `${n.title} ${n.body ?? ""}`}
      columns={[
        { label: "Date", render: (n) => <span className="whitespace-nowrap font-mono text-[0.78rem] text-muted">{formatDate(n.date)}</span>, className: "w-32" },
        { label: "Headline", render: (n) => <p className="max-w-[620px] font-medium leading-snug">{n.title}</p> },
      ]}
    />
  );
}
