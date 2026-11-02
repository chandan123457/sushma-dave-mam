"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";
import type { Message } from "@/lib/types";
import { Button, PageHeader, Spinner, useToast } from "@/components/admin/ui";

export default function MessagesAdmin() {
  const [items, setItems] = useState<Message[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const toast = useToast();

  const load = useCallback(() => api.get<Message[]>("/admin/messages").then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  const open = items?.find((m) => m.id === openId) ?? null;

  async function select(m: Message) {
    setOpenId(m.id);
    if (!m.read) {
      setItems((list) => list?.map((x) => (x.id === m.id ? { ...x, read: true } : x)) ?? null);
      await api.patch(`/admin/messages/${m.id}`, { read: true }).catch(() => {});
    }
  }

  async function remove(m: Message) {
    await api.del(`/admin/messages/${m.id}`);
    setOpenId(null);
    toast("Message deleted");
    load();
  }

  return (
    <div>
      <PageHeader title="Messages" description="Notes sent through the contact form on the website." />
      {!items ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner /> Loading
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-line bg-white/50 py-24 text-center">
          <p className="font-serif text-2xl">Inbox is empty.</p>
          <p className="mt-1 text-sm text-muted">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid overflow-hidden rounded-xl border border-line bg-white/50 lg:grid-cols-[360px_1fr]">
          <ul className="max-h-[70vh] overflow-y-auto border-b border-line lg:border-b-0 lg:border-r">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => select(m)}
                  className={clsx("w-full border-b border-line/70 px-5 py-4 text-left transition-colors", openId === m.id ? "bg-paper-2" : "hover:bg-paper-2/50")}
                >
                  <p className="flex items-center justify-between gap-3">
                    <span className={clsx("truncate text-[0.86rem]", !m.read && "font-semibold")}>{m.name}</span>
                    <span className="shrink-0 font-mono text-[0.68rem] text-muted">{new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 truncate text-[0.8rem] text-muted">
                    {!m.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />}
                    {m.subject || m.body.slice(0, 60)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <div className="min-h-[320px] p-8">
            {open ? (
              <article>
                <p className="label">{new Date(open.createdAt).toLocaleString("en-GB")}</p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">{open.subject || "No subject"}</h2>
                <p className="mt-2 text-[0.86rem] text-ink-2">
                  {open.name} · <a href={`mailto:${open.email}`} className="text-accent hover:underline">{open.email}</a>
                </p>
                <p className="mt-8 whitespace-pre-wrap leading-relaxed">{open.body}</p>
                <div className="mt-10 flex gap-2">
                  <a href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject ?? ""}`)}`}>
                    <Button type="button">Reply by email</Button>
                  </a>
                  <Button type="button" variant="danger" onClick={() => remove(open)}>
                    Delete
                  </Button>
                </div>
              </article>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted">Select a message to read it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
