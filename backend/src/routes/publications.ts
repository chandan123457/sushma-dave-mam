import { Router } from "express";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { adminCrud } from "../lib/crud.js";
import { HttpError } from "../lib/http.js";
import { slugify } from "../lib/slug.js";
import { publicationInput } from "../lib/validators.js";

const { publications } = schema;

const SORTS = {
  recent: [sql`${publications.year} desc nulls last`, desc(publications.citations)],
  cited: [desc(publications.citations), sql`${publications.year} desc nulls last`],
  title: [publications.title],
} as const;

export const publicPublications = Router();

publicPublications.get("/", async (req, res) => {
  const { q, type, year, featured, sort, limit } = req.query as Record<string, string | undefined>;
  const filters: SQL[] = [eq(publications.published, true)];
  if (q) {
    const term = `%${q.trim()}%`;
    filters.push(
      or(ilike(publications.title, term), ilike(publications.authors, term), ilike(publications.venue, term))!,
    );
  }
  if (type && type !== "all") filters.push(eq(publications.type, type as never));
  if (year) filters.push(eq(publications.year, Number(year)));
  if (featured === "true") filters.push(eq(publications.featured, true));

  const order = SORTS[(sort as keyof typeof SORTS) ?? "recent"] ?? SORTS.recent;
  const query = db.select().from(publications).where(and(...filters)).orderBy(...order).$dynamic();
  if (limit) query.limit(Math.min(Number(limit) || 0, 200));
  res.json(await query);
});

publicPublications.get("/:slug", async (req, res) => {
  const [row] = await db
    .select()
    .from(publications)
    .where(and(eq(publications.slug, req.params.slug), eq(publications.published, true)));
  if (!row) throw new HttpError(404, "Publication not found");
  res.json(row);
});

function withSlug(data: Record<string, unknown>, existing?: Record<string, unknown>) {
  const explicit = typeof data.slug === "string" && data.slug ? slugify(data.slug) : undefined;
  if (explicit) return { ...data, slug: explicit };
  if (existing) {
    const { slug: _drop, ...rest } = data;
    return rest;
  }
  // Short random suffix keeps slugs unique when two papers share a title.
  const base = slugify(String(data.title));
  return { ...data, slug: `${base}-${Math.random().toString(36).slice(2, 6)}` };
}

export const adminPublications = adminCrud({
  table: publications,
  schema: publicationInput,
  orderBy: [sql`${publications.year} desc nulls last`, desc(publications.citations)],
  prepare: withSlug,
});
