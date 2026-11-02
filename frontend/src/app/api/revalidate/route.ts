import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/data";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  // Only signed-in admins may purge the cache: verify the session with the API.
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  if (!res.ok) return Response.json({ error: "Not authenticated" }, { status: 401 });

  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
