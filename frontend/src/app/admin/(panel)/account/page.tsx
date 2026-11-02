"use client";

import { useState } from "react";
import { api } from "@/lib/admin-api";
import { Button, Field, Input, PageHeader, useToast } from "@/components/admin/ui";

export default function AccountAdmin() {
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("newPassword") !== data.get("confirm")) {
      toast("New passwords do not match", "error");
      return;
    }
    setSaving(true);
    try {
      await api.post("/auth/password", {
        currentPassword: data.get("currentPassword"),
        newPassword: data.get("newPassword"),
      });
      form.reset();
      toast("Password updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update password", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Account" description="Change the password used to sign in to this admin panel." />
      <form onSubmit={onSubmit} className="max-w-md space-y-5">
        <Field label="Current password">
          <Input name="currentPassword" type="password" autoComplete="current-password" required />
        </Field>
        <Field label="New password" hint="At least 8 characters">
          <Input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Confirm new password">
          <Input name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Button type="submit" loading={saving}>
          Update password
        </Button>
      </form>
    </div>
  );
}
