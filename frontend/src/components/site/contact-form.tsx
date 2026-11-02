"use client";

import { useState } from "react";
import clsx from "clsx";

type State = { status: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending" });
    try {
      const res = await fetch("/backend/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.issues?.[0]?.message ?? body.error ?? "Something went wrong");
      }
      form.reset();
      setState({ status: "sent" });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  }

  if (state.status === "sent") {
    return (
      <div className="flex min-h-[320px] flex-col justify-center border-t border-paper/15 pt-8">
        <p className="label !text-paper/50">Message received</p>
        <p className="mt-4 font-serif text-4xl leading-tight">Thank you — your note is on its way.</p>
        <p className="mt-3 max-w-sm text-paper/60">Replies usually follow within a few working days.</p>
        <button onClick={() => setState({ status: "idle" })} className="mt-8 self-start text-sm text-paper/70 underline underline-offset-4 hover:text-paper">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Field name="name" label="Your name" autoComplete="name" required />
      <Field name="email" label="Email" type="email" autoComplete="email" required />
      <Field name="subject" label="Subject" className="sm:col-span-2" placeholder="Collaboration, PhD enquiry, invited talk…" />
      <label className="group sm:col-span-2">
        <span className="label !text-paper/50">Message</span>
        <textarea
          name="body"
          required
          minLength={5}
          rows={4}
          className="mt-2 w-full resize-none border-b border-paper/20 bg-transparent pb-3 text-[1.05rem] text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-paper"
        />
      </label>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={clsx("text-sm", state.status === "error" ? "text-[#f0a58a]" : "text-paper/40")}>
          {state.status === "error" ? state.message : "Your details are used only to reply to you."}
        </p>
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-paper px-7 py-3.5 text-[0.9rem] font-medium text-ink transition-[transform,background-color] hover:bg-white active:scale-[0.98] disabled:opacity-60"
        >
          {state.status === "sending" ? "Sending…" : "Send message"}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  className,
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={className}>
      <span className="label !text-paper/50">{label}</span>
      <input
        {...props}
        className="mt-2 w-full border-b border-paper/20 bg-transparent pb-3 text-[1.05rem] text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-paper"
      />
    </label>
  );
}
