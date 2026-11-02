"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/admin-api";
import { Button, Field, Input } from "@/components/admin/ui";
import { Voltammogram } from "@/components/site/voltammogram";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    try {
      await api.login(String(form.get("email")), String(form.get("password")));
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next?.startsWith("/admin") ? next : "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-night text-paper lg:flex lg:flex-col lg:justify-between lg:p-14">
        <Link href="/" className="font-serif text-2xl">
          Sushma Dave
        </Link>
        <Voltammogram className="absolute left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 text-paper opacity-80" />
        <div className="relative">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper/40">Studio</p>
          <p className="mt-4 max-w-sm font-serif text-[2.6rem] leading-[1.05]">
            Publish papers, update the profile, and keep the record <em className="text-[#a9dcc6]">current.</em>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-[380px]">
          <p className="label">Admin access</p>
          <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight">Sign in</h1>
          <p className="mt-3 text-[0.9rem] text-muted">Use the administrator email and password.</p>

          <div className="mt-10 space-y-5">
            <Field label="Email">
              <Input name="email" type="email" autoComplete="username" required autoFocus />
            </Field>
            <Field label="Password">
              <Input name="password" type="password" autoComplete="current-password" required />
            </Field>
          </div>

          {error && (
            <p role="alert" className="mt-5 rounded-lg bg-[#a8432b]/10 px-3.5 py-2.5 text-[0.82rem] text-[#8f3823]">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="mt-8 h-11 w-full">
            Continue
          </Button>

          <Link href="/" className="mt-8 block text-center text-[0.8rem] text-muted hover:text-ink">
            ← Back to the website
          </Link>
        </form>
      </div>
    </div>
  );
}
