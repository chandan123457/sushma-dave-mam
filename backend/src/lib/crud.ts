import { Router } from "express";
import { asc, desc, eq, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { ZodObject, ZodRawShape } from "zod";
import { db } from "../db/index.js";
import { HttpError, idParam } from "./http.js";

type CrudTable = PgTable & { id: PgColumn; published?: PgColumn };

type CrudOptions = {
  table: CrudTable;
  schema: ZodObject<ZodRawShape>;
  orderBy: SQL[];
  /** Map validated input before writing (e.g. derive a slug). */
  prepare?: (data: Record<string, unknown>, existing?: Record<string, unknown>) => Record<string, unknown>;
};

/** Public, read-only listing: only rows marked as published. */
export function publicList({ table, orderBy }: Pick<CrudOptions, "table" | "orderBy">) {
  const router = Router();
  router.get("/", async (_req, res) => {
    const query = db.select().from(table as PgTable).$dynamic();
    if (table.published) query.where(eq(table.published, true));
    res.json(await query.orderBy(...orderBy));
  });
  return router;
}

/** Full admin CRUD for a table. */
export function adminCrud({ table, schema, orderBy, prepare = (d) => d }: CrudOptions) {
  const router = Router();
  const t = table as PgTable;

  router.get("/", async (_req, res) => {
    res.json(await db.select().from(t).orderBy(...orderBy));
  });

  router.get("/:id", async (req, res) => {
    const [row] = await db.select().from(t).where(eq(table.id, idParam(req)));
    if (!row) throw new HttpError(404, "Not found");
    res.json(row);
  });

  router.post("/", async (req, res) => {
    const data = prepare(schema.parse(req.body));
    const [row] = await db.insert(t).values(data as never).returning();
    res.status(201).json(row);
  });

  router.patch("/:id", async (req, res) => {
    const id = idParam(req);
    const [existing] = await db.select().from(t).where(eq(table.id, id));
    if (!existing) throw new HttpError(404, "Not found");
    const data = prepare(schema.partial().parse(req.body), existing as Record<string, unknown>);
    const [row] = await db.update(t).set(data as never).where(eq(table.id, id)).returning();
    res.json(row);
  });

  router.delete("/:id", async (req, res) => {
    const [row] = await db.delete(t).where(eq(table.id, idParam(req))).returning();
    if (!row) throw new HttpError(404, "Not found");
    res.status(204).end();
  });

  return router;
}

export { asc, desc };
