"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin-api";
import type { Profile } from "@/lib/types";
import { Button, Field, FileField, Input, PageHeader, Spinner, TagInput, Textarea, useToast } from "@/components/admin/ui";

type Editable = Profile;

export default function ProfileAdmin() {
  const [p, setP] = useState<Editable | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get<Profile>("/admin/profile").then(setP);
  }, []);

  if (!p) {
    return (
      <div className="flex items-center gap-2 py-20 text-sm text-muted">
        <Spinner /> Loading profile
      </div>
    );
  }

  const set = <K extends keyof Editable>(k: K, v: Editable[K]) => {
    setP((s) => (s ? { ...s, [k]: v } : s));
    setDirty(true);
  };
  const setMetric = (key: "citations" | "hIndex" | "i10Index", part: "all" | "recent", v: string) =>
    set("stats", { ...p.stats, [key]: { ...p.stats[key], [part]: Number(v) || 0 } });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/profile", p);
      setDirty(false);
      toast("Profile saved — the site is updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save}>
      <PageHeader
        title="Profile & bio"
        description="Name, portrait, biography, education, teaching and the citation metrics shown on the home page."
        actions={
          <Button type="submit" loading={saving} disabled={!dirty}>
            {dirty ? "Save changes" : "Saved"}
          </Button>
        }
      />

      <Section title="Identity" note="How the name and position appear across the site.">
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <Field label="Honorific">
            <Input value={p.honorific} onChange={(e) => set("honorific", e.target.value)} />
          </Field>
          <Field label="Full name">
            <Input value={p.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Designation">
            <Input value={p.designation} onChange={(e) => set("designation", e.target.value)} />
          </Field>
          <Field label="Department">
            <Input value={p.department} onChange={(e) => set("department", e.target.value)} />
          </Field>
          <Field label="Institution">
            <Input value={p.institution} onChange={(e) => set("institution", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={p.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <div>
          <p className="mb-1.5 text-[0.78rem] font-medium text-ink-2">Portrait</p>
          <FileField kind="image" value={p.photoUrl} onChange={(v) => set("photoUrl", v)} />
        </div>
      </Section>

      <Section title="Biography" note="The tagline sits under the name in the hero; the short bio opens the home page; the full biography is on the About page.">
        <Field label="Hero tagline">
          <Textarea rows={3} value={p.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Short bio">
          <Textarea rows={4} value={p.shortBio} onChange={(e) => set("shortBio", e.target.value)} />
        </Field>
        <Field label="Full biography" hint="Blank line = new paragraph">
          <Textarea rows={14} value={p.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>
        <Field label="Research interests" hint="Shown as tags in the hero">
          <TagInput value={p.interests} onChange={(v) => set("interests", v)} />
        </Field>
      </Section>

      <Section title="Education" note="Listed newest first.">
        <div className="space-y-3">
          {p.education.map((e, i) => (
            <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1.4fr_100px_auto]">
              <Field label="Degree">
                <Input value={e.degree} onChange={(ev) => set("education", p.education.map((x, j) => (j === i ? { ...x, degree: ev.target.value } : x)))} />
              </Field>
              <Field label="Institution">
                <Input value={e.institution} onChange={(ev) => set("education", p.education.map((x, j) => (j === i ? { ...x, institution: ev.target.value } : x)))} />
              </Field>
              <Field label="Year">
                <Input value={e.year} onChange={(ev) => set("education", p.education.map((x, j) => (j === i ? { ...x, year: ev.target.value } : x)))} />
              </Field>
              <Button type="button" variant="ghost" size="sm" className="mb-1" onClick={() => set("education", p.education.filter((_, j) => j !== i))}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={() => set("education", [...p.education, { degree: "", institution: "", year: "" }])}>
            + Add degree
          </Button>
        </div>
        <Field label="Courses taught">
          <TagInput value={p.courses} onChange={(v) => set("courses", v)} />
        </Field>
      </Section>

      <Section title="Metrics" note="From Google Scholar. Update these whenever the profile changes.">
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-line bg-paper-2/60 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            <span>Metric</span>
            <span>All time</span>
            <span className="flex items-center gap-2">
              Since
              <input
                type="number"
                value={p.stats.recentSince}
                onChange={(e) => set("stats", { ...p.stats, recentSince: Number(e.target.value) })}
                className="w-16 rounded border border-line bg-white px-1.5 py-0.5 text-ink"
              />
            </span>
          </div>
          {(["citations", "hIndex", "i10Index"] as const).map((k) => (
            <div key={k} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-3 border-b border-line/60 px-4 py-2.5 last:border-0">
              <span className="text-[0.85rem] font-medium">{k === "hIndex" ? "h-index" : k === "i10Index" ? "i10-index" : "Citations"}</span>
              <Input type="number" value={p.stats[k].all} onChange={(e) => setMetric(k, "all", e.target.value)} />
              <Input type="number" value={p.stats[k].recent} onChange={(e) => setMetric(k, "recent", e.target.value)} />
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 text-[0.78rem] font-medium text-ink-2">Citations per year</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {p.citationsByYear.map((c, i) => (
              <label key={c.year} className="rounded-lg border border-line bg-white/60 px-2.5 py-2">
                <span className="block font-mono text-[0.68rem] text-muted">{c.year}</span>
                <input
                  type="number"
                  value={c.count}
                  onChange={(e) => set("citationsByYear", p.citationsByYear.map((x, j) => (j === i ? { ...x, count: Number(e.target.value) || 0 } : x)))}
                  className="w-full bg-transparent text-[0.9rem] outline-none"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => {
                const last = p.citationsByYear.at(-1)?.year ?? new Date().getFullYear() - 1;
                set("citationsByYear", [...p.citationsByYear, { year: last + 1, count: 0 }]);
              }}
              className="rounded-lg border border-dashed border-line-strong text-[0.78rem] text-muted hover:border-ink hover:text-ink"
            >
              + Year
            </button>
          </div>
        </div>
      </Section>

      <Section title="Contact & links">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Primary email">
            <Input type="email" value={p.email} onChange={(e) => set("email", e.target.value)} required />
          </Field>
          <Field label="Alternate email">
            <Input type="email" value={p.altEmail ?? ""} onChange={(e) => set("altEmail", e.target.value || null)} />
          </Field>
          <Field label="Phone" hint="Not shown publicly">
            <Input value={p.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)} />
          </Field>
          <Field label="Google Scholar URL">
            <Input value={p.scholarUrl ?? ""} onChange={(e) => set("scholarUrl", e.target.value || null)} />
          </Field>
          <Field label="Institution profile URL">
            <Input value={p.institutionUrl ?? ""} onChange={(e) => set("institutionUrl", e.target.value || null)} />
          </Field>
        </div>
        <div>
          <p className="mb-1.5 text-[0.78rem] font-medium text-ink-2">Curriculum vitae (PDF)</p>
          <FileField value={p.cvUrl} onChange={(v) => set("cvUrl", v)} accept=".pdf" />
        </div>
      </Section>

      {dirty && (
        <div className="sticky bottom-5 z-30 mt-8 flex items-center justify-between gap-4 rounded-full bg-ink py-2.5 pl-6 pr-2.5 text-paper shadow-[0_12px_40px_rgb(0_0_0/0.25)] [animation:toast-in_.4s_cubic-bezier(.16,1,.3,1)]">
          <span className="text-[0.85rem]">You have unsaved changes</span>
          <Button type="submit" loading={saving} className="!bg-paper !text-ink hover:!bg-white">
            Save changes
          </Button>
        </div>
      )}
    </form>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-line py-10 first-of-type:pt-2 lg:grid-cols-[240px_1fr] lg:gap-12">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        {note && <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{note}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
