import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { HttpError, idParam } from "../lib/http.js";
import { slugify } from "../lib/slug.js";

const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(415, "Only PDF, Word and image files are allowed"));
  },
});

// Everything except the file bytes, for listings and API responses.
const { data: _data, ...mediaInfo } = getTableColumns(schema.media);

export function storedFilename(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const base = slugify(path.basename(originalName, ext), 50) || "file";
  return `${base}-${randomBytes(4).toString("hex")}${ext}`;
}

/** Public: streams an uploaded file out of the database. */
export const publicUploads = Router();

publicUploads.get("/:filename", async (req, res) => {
  const [file] = await db
    .select({ data: schema.media.data, mime: schema.media.mime, originalName: schema.media.originalName })
    .from(schema.media)
    .where(eq(schema.media.filename, req.params.filename));
  if (!file) throw new HttpError(404, "File not found");
  res.setHeader("Content-Type", file.mime);
  res.setHeader("Content-Length", file.data.length);
  // Filenames carry a random suffix, so a given URL never changes content.
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Content-Disposition", `inline; filename="${file.originalName.replace(/"/g, "")}"`);
  res.end(file.data);
});

export const uploadsRouter = Router();

uploadsRouter.get("/", async (_req, res) => {
  res.json(await db.select(mediaInfo).from(schema.media).orderBy(desc(schema.media.createdAt)));
});

uploadsRouter.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) throw new HttpError(400, "No file received");
  const filename = storedFilename(req.file.originalname);
  const [row] = await db
    .insert(schema.media)
    .values({
      filename,
      originalName: req.file.originalname,
      url: `/uploads/${filename}`,
      mime: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
    })
    .returning(mediaInfo);
  res.status(201).json(row);
});

uploadsRouter.delete("/:id", async (req, res) => {
  const [row] = await db.delete(schema.media).where(eq(schema.media.id, idParam(req))).returning({ id: schema.media.id });
  if (!row) throw new HttpError(404, "Not found");
  res.status(204).end();
});
