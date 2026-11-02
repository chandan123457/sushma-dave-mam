import { Router } from "express";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { adminCrud, publicList } from "../lib/crud.js";
import { HttpError, idParam } from "../lib/http.js";
import {
  awardInput,
  collaboratorInput,
  messageInput,
  newsInput,
  profileInput,
  projectInput,
  researchAreaInput,
} from "../lib/validators.js";
import { requireAdmin } from "../middleware/auth.js";
import { authRouter } from "./auth.js";
import { adminPublications, publicPublications } from "./publications.js";
import { uploadsRouter } from "./uploads.js";

const { profile, researchAreas, projects, news, awards, collaborators, messages, publications, media } = schema;

const order = {
  research: [asc(researchAreas.sortOrder), asc(researchAreas.id)],
  projects: [asc(projects.sortOrder), desc(projects.id)],
  news: [desc(news.date), desc(news.id)],
  awards: [asc(awards.sortOrder), desc(awards.id)],
  collaborators: [asc(collaborators.sortOrder), asc(collaborators.id)],
};

async function getProfile() {
  const [row] = await db.select().from(profile).where(eq(profile.id, 1));
  if (!row) throw new HttpError(404, "Profile has not been set up yet");
  return row;
}

/* ---------------------------------- public --------------------------------- */

export const api = Router();

api.get("/health", (_req, res) => res.json({ ok: true }));
api.use("/auth", authRouter);

api.get("/profile", async (_req, res) => res.json(await getProfile()));
api.use("/publications", publicPublications);
api.use("/research", publicList({ table: researchAreas, orderBy: order.research }));
api.use("/projects", publicList({ table: projects, orderBy: order.projects }));
api.use("/news", publicList({ table: news, orderBy: order.news }));
api.use("/awards", publicList({ table: awards, orderBy: order.awards }));
api.use("/collaborators", publicList({ table: collaborators, orderBy: order.collaborators }));

const recentMessages: number[] = [];
api.post("/messages", async (req, res) => {
  // Global soft limit of 30 messages per 10 minutes to keep spam bots at bay.
  const now = Date.now();
  while (recentMessages.length && recentMessages[0]! < now - 10 * 60 * 1000) recentMessages.shift();
  if (recentMessages.length >= 30) throw new HttpError(429, "Please try again a little later.");
  recentMessages.push(now);

  const input = messageInput.parse(req.body);
  await db.insert(messages).values(input);
  res.status(201).json({ ok: true });
});

/* ---------------------------------- admin ---------------------------------- */

const admin = Router();
admin.use(requireAdmin);

admin.get("/overview", async (_req, res) => {
  const tally = async (table: typeof publications | typeof messages | typeof news | typeof media) =>
    (await db.select({ n: count() }).from(table))[0]!.n;
  const [pubTotal, newsTotal, mediaTotal] = await Promise.all([tally(publications), tally(news), tally(media)]);
  const [{ unread }] = await db
    .select({ unread: sql<number>`count(*) filter (where ${messages.read} = false)`.mapWith(Number) })
    .from(messages);
  const [{ citations }] = await db
    .select({ citations: sql<number>`coalesce(sum(${publications.citations}), 0)`.mapWith(Number) })
    .from(publications);
  const latest = await db
    .select({ id: publications.id, title: publications.title, year: publications.year, updatedAt: publications.updatedAt })
    .from(publications)
    .orderBy(desc(publications.updatedAt))
    .limit(5);
  res.json({ publications: pubTotal, news: newsTotal, media: mediaTotal, unreadMessages: unread, citations, latest });
});

admin.get("/profile", async (_req, res) => res.json(await getProfile()));
admin.put("/profile", async (req, res) => {
  const data = profileInput.parse(req.body);
  const [row] = await db
    .insert(profile)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({ target: profile.id, set: data })
    .returning();
  res.json(row);
});

admin.use("/publications", adminPublications);
admin.use("/research", adminCrud({ table: researchAreas, schema: researchAreaInput, orderBy: order.research }));
admin.use("/projects", adminCrud({ table: projects, schema: projectInput, orderBy: order.projects }));
admin.use("/news", adminCrud({ table: news, schema: newsInput, orderBy: order.news }));
admin.use("/awards", adminCrud({ table: awards, schema: awardInput, orderBy: order.awards }));
admin.use("/collaborators", adminCrud({ table: collaborators, schema: collaboratorInput, orderBy: order.collaborators }));
admin.use("/uploads", uploadsRouter);

admin.get("/messages", async (_req, res) => {
  res.json(await db.select().from(messages).orderBy(desc(messages.createdAt)));
});
admin.patch("/messages/:id", async (req, res) => {
  const [row] = await db
    .update(messages)
    .set({ read: Boolean(req.body?.read) })
    .where(eq(messages.id, idParam(req)))
    .returning();
  if (!row) throw new HttpError(404, "Not found");
  res.json(row);
});
admin.delete("/messages/:id", async (req, res) => {
  await db.delete(messages).where(eq(messages.id, idParam(req)));
  res.status(204).end();
});

api.use("/admin", admin);
