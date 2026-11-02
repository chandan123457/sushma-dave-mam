import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { count, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db, pool, schema } from "./index.js";
import { slugify } from "../lib/slug.js";
import {
  BOOK_TITLES,
  HIDDEN_TITLE_PATTERNS,
  newsContent,
  profileContent,
  projectContent,
  researchContent,
} from "./seed-content.js";

type ScholarPublication = {
  scholarId: string;
  title: string;
  authors: string;
  venue: string;
  publisher: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  year: number | null;
  publishedOn: string | null;
  type: (typeof schema.publicationType.enumValues)[number];
  abstract: string | null;
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
  citations: number;
};

type ScholarExport = {
  profile: {
    interests: string[];
    stats: { citations: { all: number; since2021: number }; hIndex: { all: number; since2021: number }; i10Index: { all: number; since2021: number } };
    citationsByYear: { year: number; count: number }[];
    coauthors: { name: string; affiliation: string }[];
  };
  publications: ScholarPublication[];
};

const DATA_DIR = path.resolve("src/db/seed-data");
const scholar: ScholarExport = JSON.parse(await fs.readFile(path.join(DATA_DIR, "scholar.json"), "utf8"));

async function isEmpty(table: PgTable) {
  const [{ n }] = await db.select({ n: count() }).from(table);
  return n === 0;
}

/* ── Admin ─────────────────────────────────────────────────────────────── */
const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding");
await db
  .insert(schema.admins)
  .values({ email, name: process.env.ADMIN_NAME ?? "Administrator", passwordHash: await bcrypt.hash(password, 12) })
  .onConflictDoNothing({ target: schema.admins.email });
console.log(`✓ admin ${email}`);

/* ── Portrait ──────────────────────────────────────────────────────────── */
const PORTRAIT = "sushma-dave-portrait.webp";
const photoUrl = `/uploads/${PORTRAIT}`;
const portrait = await fs.readFile(path.join(DATA_DIR, "portrait.webp"));
await db
  .insert(schema.media)
  .values({ filename: PORTRAIT, originalName: PORTRAIT, url: photoUrl, mime: "image/webp", size: portrait.length, data: portrait })
  .onConflictDoNothing({ target: schema.media.filename });
console.log("✓ portrait");

/* ── Profile (created once; later edits in admin are never overwritten) ──── */
const s = scholar.profile.stats;
await db
  .insert(schema.profile)
  .values({
    id: 1,
    ...profileContent,
    photoUrl,
    interests: scholar.profile.interests.map((i) => i.charAt(0).toUpperCase() + i.slice(1)),
    stats: {
      citations: { all: s.citations.all, recent: s.citations.since2021 },
      hIndex: { all: s.hIndex.all, recent: s.hIndex.since2021 },
      i10Index: { all: s.i10Index.all, recent: s.i10Index.since2021 },
      recentSince: 2021,
    },
    citationsByYear: scholar.profile.citationsByYear,
  })
  .onConflictDoNothing();
console.log("✓ profile");

/* ── Publications ──────────────────────────────────────────────────────── */
const norm = (t: string) => t.toLowerCase().replace(/[‐‑–—-]/g, " ").replace(/[^a-z0-9:, ]/g, "").replace(/\s+/g, " ").trim();
const BOOKS = BOOK_TITLES.map(norm);
// Venues that are edited volumes rather than journals.
const isBookVenue = (venue: string) => {
  const v = norm(venue);
  return v.length > 10 && BOOKS.some((b) => v.startsWith(b.slice(0, 40)) || b.startsWith(v.slice(0, 40)));
};
const seen = new Set<string>();
const usedSlugs = new Set<string>();
let hidden = 0;

// Scholar lists the most-cited version first, so later duplicates get hidden.
const rows = scholar.publications.map((p) => {
  const key = norm(p.title);
  const duplicate = seen.has(key);
  seen.add(key);
  const junk = HIDDEN_TITLE_PATTERNS.some((re) => re.test(p.title));
  const published = !duplicate && !junk;
  if (!published) hidden++;

  let slug = slugify(p.title);
  for (let i = 2; usedSlugs.has(slug); i++) slug = `${slugify(p.title)}-${i}`;
  usedSlugs.add(slug);

  const isBook = BOOKS.includes(key) && (!p.venue || !/\d+-\d+/.test(p.venue));
  const type = isBook ? "book" : p.type === "journal" && isBookVenue(p.venue) ? "chapter" : p.type;
  return {
    ...p,
    slug,
    type: type as ScholarPublication["type"],
    published,
  };
});

// Feature the six most-cited journal articles and chapters on the home page.
rows
  .filter((r) => r.published && r.type !== "book")
  .sort((a, b) => b.citations - a.citations)
  .slice(0, 6)
  .forEach((r) => Object.assign(r, { featured: true }));

for (const row of rows) {
  await db
    .insert(schema.publications)
    .values(row)
    .onConflictDoUpdate({
      target: schema.publications.scholarId,
      // Re-running the seed refreshes citation counts only; editorial fields stay as edited.
      set: { citations: sql`excluded.citations` },
    });
}
console.log(`✓ ${rows.length} publications (${hidden} hidden as duplicates or malformed records)`);

/* ── Collections (only seeded when empty) ──────────────────────────────── */
if (await isEmpty(schema.researchAreas)) {
  await db.insert(schema.researchAreas).values(researchContent);
  console.log(`✓ ${researchContent.length} research areas`);
}
if (await isEmpty(schema.projects)) {
  await db.insert(schema.projects).values(projectContent);
  console.log(`✓ ${projectContent.length} projects`);
}
if (await isEmpty(schema.news)) {
  await db.insert(schema.news).values(newsContent);
  console.log(`✓ ${newsContent.length} news items`);
}
if (await isEmpty(schema.collaborators)) {
  const list = scholar.profile.coauthors.map((c, i) => ({
    name: c.name.replace(/\.\.\.$/, "").trim(),
    affiliation: c.affiliation || null,
    sortOrder: i,
  }));
  await db.insert(schema.collaborators).values(list);
  console.log(`✓ ${list.length} collaborators`);
}

await pool.end();
console.log("Seed complete.");
