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
      <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="h-section mt-5 text-2xl">Message sent</p>
        <p className="mt-2 max-w-xs text-fg-muted">Thank you for getting in touch. You will receive a reply by email.</p>
        <button onClick={() => setState({ status: "idle" })} className="mt-6 text-sm font-semibold text-brand hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" autoComplete="name" required placeholder="Your name" />
      <Field name="email" label="Email address" type="email" autoComplete="email" required placeholder="you@institution.edu" />
      <Field name="subject" label="Subject" className="sm:col-span-2" placeholder="Collaboration, Ph.D. enquiry, invited talk…" />
      <label className="sm:col-span-2">
        <span className="mb-2 block text-[0.85rem] font-semibold text-fg">Message</span>
        <textarea
          name="body"
          required
          minLength={5}
          rows={5}
          placeholder="How can Dr. Dave help?"
          className="w-full resize-none rounded-xl border border-hairline-strong bg-white px-4 py-3 text-[0.95rem] text-fg outline-none transition-[border-color,box-shadow] placeholder:text-fg-faint focus:border-brand focus:shadow-[0_0_0_4px_rgb(15_61_115/0.1)]"
        />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={clsx("text-[0.85rem]", state.status === "error" ? "font-medium text-[#b42318]" : "text-fg-muted")}>
          {state.status === "error" ? state.message : "Your details are used only to reply to you."}
        </p>
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-7 text-[0.95rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(15_61_115/0.55)] transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {state.status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, className, ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={className}>
      <span className="mb-2 block text-[0.85rem] font-semibold text-fg">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-hairline-strong bg-white px-4 text-[0.95rem] text-fg outline-none transition-[border-color,box-shadow] placeholder:text-fg-faint focus:border-brand focus:shadow-[0_0_0_4px_rgb(15_61_115/0.1)]"
      />
    </label>
  );
}
