"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/admin/ui";
import type { Project } from "@/lib/types";

export default function ProjectsAdmin() {
  return (
    <ResourceManager<Project & Record<string, unknown>>
      endpoint="/admin/projects"
      title="Projects"
      description="Funded research projects listed on the Research page."
      singular="project"
      fields={[
        { name: "title", label: "Title", type: "textarea", rows: 2, required: true },
        { name: "funder", label: "Funding agency", type: "text", span: 1 },
        { name: "amount", label: "Amount", type: "text", placeholder: "₹ 10,00,000", span: 1 },
        { name: "role", label: "Role", type: "text", placeholder: "Principal Investigator", span: 1 },
        { name: "period", label: "Period", type: "text", placeholder: "2023 – 2026", span: 1 },
        { name: "status", label: "Status", type: "select", options: [{ value: "ongoing", label: "Ongoing" }, { value: "completed", label: "Completed" }], span: 1 },
        { name: "sortOrder", label: "Order", type: "number", span: 1 },
        { name: "description", label: "Description", type: "textarea", rows: 4 },
        { name: "published", label: "Visible on site", type: "toggle" },
      ]}
      defaults={{ status: "ongoing", sortOrder: 0, published: true }}
      columns={[
        { label: "Project", render: (p) => <p className="max-w-[560px] font-medium leading-snug">{p.title}</p> },
        { label: "Funder", render: (p) => <span className="text-ink-2">{p.funder ?? "—"}</span>, className: "hidden md:table-cell" },
        { label: "Status", render: (p) => <Badge tone={p.status === "ongoing" ? "accent" : "neutral"}>{p.status}</Badge> },
      ]}
    />
  );
}
