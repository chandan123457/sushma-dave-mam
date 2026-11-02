"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import type { Collaborator } from "@/lib/types";

export default function CollaboratorsAdmin() {
  return (
    <ResourceManager<Collaborator & Record<string, unknown>>
      endpoint="/admin/collaborators"
      title="Collaborators"
      description="Co-authors and partner researchers shown on the home page."
      singular="collaborator"
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "affiliation", label: "Affiliation", type: "textarea", rows: 2 },
        { name: "url", label: "Profile link", type: "url", placeholder: "https://" },
        { name: "sortOrder", label: "Order", type: "number", span: 1 },
        { name: "published", label: "Visible on site", type: "toggle", span: 1 },
      ]}
      defaults={{ sortOrder: 0, published: true }}
      search={(c) => `${c.name} ${c.affiliation ?? ""}`}
      columns={[
        { label: "Name", render: (c) => <p className="font-medium">{c.name}</p> },
        { label: "Affiliation", render: (c) => <p className="max-w-[520px] text-[0.82rem] text-muted">{c.affiliation ?? "—"}</p> },
      ]}
    />
  );
}
