"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import type { ResearchArea } from "@/lib/types";

export default function ResearchAdmin() {
  return (
    <ResourceManager<ResearchArea & Record<string, unknown>>
      endpoint="/admin/research"
      title="Research areas"
      description="The themes shown on the home page and the Research page. Keywords link each area to matching papers."
      singular="research area"
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "summary", label: "Summary", type: "textarea", rows: 3, hint: "One or two sentences", required: true },
        { name: "description", label: "Full description", type: "textarea", rows: 8, hint: "Blank line = new paragraph" },
        { name: "keywords", label: "Keywords", type: "tags", hint: "Used to find related papers" },
        { name: "imageUrl", label: "Image", type: "image", hint: "Optional" },
        { name: "sortOrder", label: "Order", type: "number", span: 1 },
        { name: "published", label: "Visible on site", type: "toggle", span: 1 },
      ]}
      defaults={{ keywords: [], sortOrder: 0, published: true, description: "" }}
      columns={[
        { label: "#", render: (r) => <span className="font-mono text-[0.8rem] text-muted">{String(r.sortOrder).padStart(2, "0")}</span>, className: "w-12" },
        {
          label: "Area",
          render: (r) => (
            <div className="max-w-[640px]">
              <p className="font-serif text-xl leading-tight">{r.title}</p>
              <p className="mt-1 line-clamp-2 text-[0.8rem] text-muted">{r.summary}</p>
            </div>
          ),
        },
      ]}
    />
  );
}
