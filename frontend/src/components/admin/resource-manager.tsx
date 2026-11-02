"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";
import { Badge, Button, Field, FileField, Input, PageHeader, Select, Spinner, TagInput, Textarea, Toggle, useToast } from "./ui";

type Row = { id: number; published?: boolean } & Record<string, unknown>;

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "toggle" | "tags" | "image" | "file" | "url";
  options?: { value: string; label: string }[];
  hint?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  span?: 1 | 2;
  required?: boolean;
};

export type Column<T> = { label: string; render: (row: T) => React.ReactNode; className?: string };

export type FilterDef<T> = { label: string; options: { value: string; label: string }[]; test: (row: T, value: string) => boolean };

type Props<T extends Row> = {
  endpoint: string;
  title: string;
  description?: string;
  singular: string;
  fields: FieldDef[];
  columns: Column<T>[];
  /** Initial values for a new row; pass a function when they depend on the current date. */
  defaults: Partial<T> | (() => Partial<T>);
  search?: (row: T) => string;
  filters?: FilterDef<T>[];
  sheetWidth?: "md" | "lg";
};

export function ResourceManager<T extends Row>({
  endpoint,
  title,
  description,
  singular,
  fields,
  columns,
  defaults,
  search,
  filters = [],
  sheetWidth = "md",
}: Props<T>) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<string[]>(filters.map(() => "all"));
  const toast = useToast();
  const createNew = () => setEditing(typeof defaults === "function" ? defaults() : { ...defaults });

  const load = useCallback(async () => {
    try {
      setRows(await api.get<T[]>(endpoint));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not load", "error");
    }
  }, [endpoint, toast]);

  useEffect(() => {
    let alive = true;
    api
      .get<T[]>(endpoint)
      .then((data) => alive && setRows(data))
      .catch((e) => toast(e instanceof Error ? e.message : "Could not load", "error"));
    return () => {
      alive = false;
    };
  }, [endpoint, toast]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!q || !search || search(r).toLowerCase().includes(q)) &&
        filters.every((f, i) => filterValues[i] === "all" || f.test(r, filterValues[i]!)),
    );
  }, [rows, query, search, filters, filterValues]);

  async function togglePublished(row: T) {
    const next = !row.published;
    setRows((rs) => rs?.map((r) => (r.id === row.id ? { ...r, published: next } : r)) ?? null);
    try {
      await api.patch(`${endpoint}/${row.id}`, { published: next });
      toast(next ? "Now visible on the site" : "Hidden from the site");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
      load();
    }
  }

  const hasPublished = fields.some((f) => f.name === "published");

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={<Button onClick={createNew}>+ New {singular}</Button>}
      />

      {(search || filters.length > 0) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {search && (
            <div className="relative flex-1 sm:max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.3" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="!pl-9" />
            </div>
          )}
          {filters.map((f, i) => (
            <div key={f.label} className="sm:w-44">
              <Select
                aria-label={f.label}
                value={filterValues[i]}
                onChange={(e) => setFilterValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                options={[{ value: "all", label: `All · ${f.label}` }, ...f.options]}
              />
            </div>
          ))}
          {rows && <p className="text-[0.78rem] text-muted sm:ml-auto">{visible.length} of {rows.length}</p>}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line bg-white/55">
        {!rows ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted">
            <Spinner /> Loading
          </div>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl">{rows.length ? "No matches." : `No ${title.toLowerCase()} yet.`}</p>
            {!rows.length && (
              <Button variant="secondary" className="mt-4" onClick={createNew}>
                Add the first {singular}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                  {columns.map((c) => (
                    <th key={c.label} className={clsx("px-5 py-3 font-medium", c.className)}>
                      {c.label}
                    </th>
                  ))}
                  {hasPublished && <th className="w-24 px-5 py-3 font-medium">Visible</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setEditing(row)}
                    className={clsx("cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-paper-2/60", row.published === false && "opacity-55")}
                  >
                    {columns.map((c) => (
                      <td key={c.label} className={clsx("px-5 py-4 align-top", c.className)}>
                        {c.render(row)}
                      </td>
                    ))}
                    {hasPublished && (
                      <td className="px-5 py-4 align-top" onClick={(e) => e.stopPropagation()}>
                        <button
                          role="switch"
                          aria-checked={!!row.published}
                          aria-label="Toggle visibility"
                          onClick={() => togglePublished(row)}
                          className={clsx("relative h-5 w-9 rounded-full transition-colors", row.published ? "bg-accent" : "bg-ink/15")}
                        >
                          <span className={clsx("absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", row.published ? "translate-x-[18px]" : "translate-x-0.5")} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Editor
          key={(editing.id as number) ?? "new"}
          endpoint={endpoint}
          singular={singular}
          fields={fields}
          initial={editing}
          width={sheetWidth}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function Editor({
  endpoint,
  singular,
  fields,
  initial,
  width,
  onClose,
  onSaved,
}: {
  endpoint: string;
  singular: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  width: "md" | "lg";
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useToast();
  const isNew = initial.id === undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (name: string, v: unknown) => setValues((s) => ({ ...s, [name]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = Object.fromEntries(
      fields.map((f) => {
        const v = values[f.name];
        if (f.type === "number") return [f.name, v === "" || v === null || v === undefined ? null : Number(v)];
        return [f.name, v ?? (f.type === "tags" ? [] : f.type === "toggle" ? false : null)];
      }),
    );
    try {
      if (isNew) await api.post(endpoint, payload);
      else await api.patch(`${endpoint}/${initial.id}`, payload);
      toast(isNew ? `${singular[0]!.toUpperCase()}${singular.slice(1)} created` : "Changes saved");
      onSaved();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await api.del(`${endpoint}/${initial.id}`);
      toast("Deleted");
      onSaved();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-night/40 backdrop-blur-[2px] [animation:fade-in_.3s_ease]" onClick={onClose} />
      <form
        onSubmit={save}
        className={clsx(
          "relative flex h-full w-full flex-col bg-paper shadow-[-20px_0_60px_rgb(0_0_0/0.15)] [animation:sheet-in_.5s_cubic-bezier(.16,1,.3,1)]",
          width === "lg" ? "max-w-3xl" : "max-w-xl",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-7 py-5">
          <div>
            <p className="label">{isNew ? "New" : "Editing"}</p>
            <h2 className="mt-1 font-serif text-[1.7rem] capitalize leading-none">{singular}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Close">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-7 py-7">
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {fields.map((f) => (
              <div key={f.name} className={f.span === 1 ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                <FieldInput def={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
              </div>
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-line bg-paper-2/60 px-7 py-4">
          {!isNew ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-[0.8rem] text-ink-2">Delete permanently?</span>
                <Button type="button" size="sm" variant="danger" onClick={remove} loading={saving}>
                  Yes, delete
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="button" size="sm" variant="ghost" className="!text-[#a8432b]" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isNew ? "Create" : "Save changes"}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function FieldInput({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const str = (value ?? "") as string;
  switch (def.type) {
    case "toggle":
      return <Toggle checked={!!value} onChange={onChange} label={def.label} description={def.description} />;
    case "textarea":
      return (
        <Field label={def.label} hint={def.hint}>
          <Textarea value={str} rows={def.rows ?? 4} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} required={def.required} />
        </Field>
      );
    case "select":
      return (
        <Field label={def.label} hint={def.hint}>
          <Select value={str} onChange={(e) => onChange(e.target.value)} options={def.options ?? []} />
        </Field>
      );
    case "tags":
      return (
        <Field label={def.label} hint={def.hint}>
          <TagInput value={(value as string[]) ?? []} onChange={onChange} placeholder={def.placeholder} />
        </Field>
      );
    case "image":
    case "file":
      return (
        <div>
          <p className="mb-1.5 flex items-baseline justify-between text-[0.78rem] font-medium text-ink-2">
            {def.label}
            {def.hint && <span className="text-[0.72rem] font-normal text-faint">{def.hint}</span>}
          </p>
          <FileField value={(value as string) ?? null} onChange={onChange} kind={def.type} />
        </div>
      );
    default:
      return (
        <Field label={def.label} hint={def.hint}>
          <Input
            type={def.type === "number" ? "number" : def.type === "date" ? "date" : def.type === "url" ? "url" : "text"}
            value={value === null || value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={def.placeholder}
            required={def.required}
          />
        </Field>
      );
  }
}

export { Badge };
