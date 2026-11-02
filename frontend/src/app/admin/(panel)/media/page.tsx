"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";
import type { Media } from "@/lib/types";
import { Button, PageHeader, Spinner, useToast } from "@/components/admin/ui";

function size(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaAdmin() {
  const [items, setItems] = useState<Media[] | null>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const load = useCallback(() => api.get<Media[]>("/admin/uploads").then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  async function uploadAll(files: FileList | File[]) {
    const list = [...files];
    setUploading(list.length);
    for (const f of list) {
      try {
        await api.upload(f);
      } catch (e) {
        toast(`${f.name}: ${e instanceof Error ? e.message : "failed"}`, "error");
      }
      setUploading((n) => n - 1);
    }
    toast(list.length === 1 ? "File uploaded" : `${list.length} files uploaded`);
    load();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
    toast("Link copied");
  }

  async function remove(m: Media) {
    if (!confirm(`Delete ${m.originalName}? Any page linking to it will break.`)) return;
    await api.del(`/admin/uploads/${m.id}`);
    toast("Deleted");
    load();
  }

  return (
    <div>
      <PageHeader
        title="Files & media"
        description="Upload PDFs, your CV and images, then copy the link into any publication or page."
        actions={<Button onClick={() => input.current?.click()}>Upload files</Button>}
      />
      <input ref={input} type="file" multiple className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={(e) => e.target.files && uploadAll(e.target.files)} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadAll(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className={clsx(
          "mb-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center transition-colors",
          dragging ? "border-accent bg-accent-soft/50" : "border-line-strong bg-white/40 hover:border-ink/50",
        )}
      >
        {uploading > 0 ? (
          <p className="flex items-center gap-2 text-sm text-ink-2">
            <Spinner /> Uploading {uploading} file{uploading > 1 ? "s" : ""}…
          </p>
        ) : (
          <>
            <p className="font-serif text-2xl">Drop files here</p>
            <p className="mt-1 text-[0.82rem] text-muted">PDF, Word or images · up to 25 MB each</p>
          </>
        )}
      </div>

      {!items ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner /> Loading
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted">No files yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="group overflow-hidden rounded-xl border border-line bg-white/60">
              <div className="flex aspect-[4/3] items-center justify-center bg-paper-2">
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-2xl uppercase text-muted">{m.filename.split(".").pop()}</span>
                )}
              </div>
              <div className="p-3.5">
                <p className="truncate text-[0.82rem] font-medium" title={m.originalName}>
                  {m.originalName}
                </p>
                <p className="mt-0.5 font-mono text-[0.68rem] text-muted">
                  {size(m.size)} · {new Date(m.createdAt).toLocaleDateString("en-GB")}
                </p>
                <div className="mt-3 flex gap-3 text-[0.75rem]">
                  <button onClick={() => copy(m.url)} className="font-medium text-accent hover:underline">
                    Copy link
                  </button>
                  <a href={m.url} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                    Open
                  </a>
                  <button onClick={() => remove(m)} className="ml-auto text-muted hover:text-[#a8432b]">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
