"use client";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`/backend${path}`, {
    ...init,
    credentials: "same-origin",
    headers: isForm ? init.headers : { "Content-Type": "application/json", ...init.headers },
  });
  if (res.status === 401 && !path.startsWith("/auth/login")) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new ApiError(401, "Session expired");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const issue = body.issues?.[0];
    const msg = issue ? `${issue.path?.join(".") || "Field"}: ${issue.message}` : body.error;
    throw new ApiError(res.status, msg ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

/** Tell the Next.js server to drop cached public pages so edits show immediately. */
export async function refreshSite() {
  await fetch("/api/revalidate", { method: "POST", credentials: "same-origin" }).catch(() => {});
}

async function mutate<T>(path: string, init: RequestInit): Promise<T> {
  const result = await request<T>(path, init);
  await refreshSite();
  return result;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => mutate<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => mutate<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => mutate<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path: string) => mutate<void>(path, { method: "DELETE" }),
  upload: <T>(file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<T>("/admin/uploads", { method: "POST", body: form });
  },
  login: (email: string, password: string) =>
    request<{ admin: { email: string; name: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  me: () => request<{ admin: { id: number; email: string; name: string } }>("/auth/me"),
};
