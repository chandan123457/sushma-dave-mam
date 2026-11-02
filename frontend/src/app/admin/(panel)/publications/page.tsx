"use client";

import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";
import { Badge } from "@/components/admin/ui";
import { PUBLICATION_TYPES, TYPE_LABEL, type Publication } from "@/lib/types";

const typeOptions = PUBLICATION_TYPES.map((t) => ({ value: t, label: TYPE_LABEL[t] }));

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "textarea", rows: 2, required: true },
  { name: "authors", label: "Authors", type: "text", hint: "Comma separated", required: true, placeholder: "S Dave, J Das, …" },
  { name: "type", label: "Type", type: "select", options: typeOptions, span: 1 },
  { name: "year", label: "Year", type: "number", span: 1 },
  { name: "venue", label: "Journal / book / conference", type: "text", placeholder: "e.g. Medicinal Chemistry Research" },
  { name: "publisher", label: "Publisher", type: "text", span: 1 },
  { name: "publishedOn", label: "Publication date", type: "text", hint: "e.g. 2023/3", span: 1 },
  { name: "volume", label: "Volume", type: "text", span: 1 },
  { name: "issue", label: "Issue", type: "text", span: 1 },
  { name: "pages", label: "Pages", type: "text", span: 1 },
  { name: "citations", label: "Citations", type: "number", span: 1 },
  { name: "abstract", label: "Abstract", type: "textarea", rows: 8, hint: "Blank line = new paragraph" },
  { name: "doi", label: "DOI", type: "text", placeholder: "10.1007/…", span: 1 },
  { name: "url", label: "Publisher link", type: "url", placeholder: "https://", span: 1 },
  { name: "pdfUrl", label: "PDF", type: "file", hint: "Upload or paste a link" },
  { name: "coverUrl", label: "Cover image", type: "image", hint: "Shown for books" },
  { name: "featured", label: "Feature on home page", type: "toggle", description: "Shown under “Most-cited publications”.", span: 1 },
  { name: "published", label: "Visible on site", type: "toggle", description: "Turn off to keep as a draft.", span: 1 },
];

export default function PublicationsAdmin() {
  return (
    <ResourceManager<Publication & Record<string, unknown>>
      endpoint="/admin/publications"
      title="Publications"
      description="Every paper, chapter and book on the site. Click a row to edit; use the switch to show or hide it."
      singular="publication"
      sheetWidth="lg"
      fields={fields}
      defaults={() => ({ type: "journal", citations: 0, featured: false, published: true, year: new Date().getFullYear() })}
      search={(p) => `${p.title} ${p.authors} ${p.venue} ${p.year ?? ""}`}
      filters={[
        { label: "Type", options: typeOptions, test: (p, v) => p.type === v },
        {
          label: "Status",
          options: [
            { value: "live", label: "Visible" },
            { value: "hidden", label: "Hidden" },
            { value: "featured", label: "Featured" },
            { value: "no-abstract", label: "Missing abstract" },
          ],
          test: (p, v) => (v === "live" ? p.published : v === "hidden" ? !p.published : v === "featured" ? p.featured : !p.abstract),
        },
      ]}
      columns={[
        {
          label: "Title",
          render: (p) => (
            <div className="max-w-[560px]">
              <p className="line-clamp-2 font-medium leading-snug">{p.title}</p>
              <p className="mt-1 line-clamp-1 text-[0.78rem] text-muted">{p.venue || p.authors}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.featured && <Badge tone="accent">Featured</Badge>}
                {p.pdfUrl && <Badge>PDF</Badge>}
                {!p.abstract && <Badge tone="muted">No abstract</Badge>}
              </div>
            </div>
          ),
        },
        { label: "Type", render: (p) => <span className="text-ink-2">{TYPE_LABEL[p.type]}</span>, className: "hidden md:table-cell whitespace-nowrap" },
        { label: "Year", render: (p) => <span className="font-mono text-[0.8rem]">{p.year ?? "—"}</span>, className: "w-16" },
        { label: "Cit.", render: (p) => <span className="font-mono text-[0.8rem]">{p.citations}</span>, className: "w-16 hidden sm:table-cell" },
      ]}
    />
  );
}
