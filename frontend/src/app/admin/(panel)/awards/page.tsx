"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import type { Award } from "@/lib/types";

export default function AwardsAdmin() {
  return (
    <ResourceManager<Award & Record<string, unknown>>
      endpoint="/admin/awards"
      title="Awards & service"
      description="Honours, memberships, editorial roles and invited positions — shown on the About page."
      singular="award"
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "issuer", label: "Awarded by / organisation", type: "text", span: 1 },
        { name: "year", label: "Year", type: "text", span: 1 },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
        { name: "sortOrder", label: "Order", type: "number", span: 1 },
        { name: "published", label: "Visible on site", type: "toggle", span: 1 },
      ]}
      defaults={{ sortOrder: 0, published: true }}
      columns={[
        { label: "Year", render: (a) => <span className="font-mono text-[0.8rem] text-muted">{a.year ?? "—"}</span>, className: "w-20" },
        {
          label: "Award",
          render: (a) => (
            <div>
              <p className="font-medium">{a.title}</p>
              {a.issuer && <p className="text-[0.8rem] text-muted">{a.issuer}</p>}
            </div>
          ),
        },
      ]}
    />
  );
}
