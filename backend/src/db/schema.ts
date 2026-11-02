import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  date,
  index,
  customType,
} from "drizzle-orm/pg-core";

// Uploaded files live in the database so they survive redeploys on hosts with temporary disks.
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

export type Education = { degree: string; institution: string; year: string };
export type Metric = { all: number; recent: number };
export type ScholarStats = {
  citations: Metric;
  hIndex: Metric;
  i10Index: Metric;
  recentSince: number;
};

// Single-row table (id = 1) that holds everything shown in the hero & about sections.
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: varchar("name", { length: 160 }).notNull(),
  honorific: varchar("honorific", { length: 20 }).notNull().default("Dr."),
  designation: varchar("designation", { length: 160 }).notNull(),
  department: varchar("department", { length: 200 }).notNull(),
  institution: varchar("institution", { length: 200 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  tagline: text("tagline").notNull(),
  shortBio: text("short_bio").notNull(),
  bio: text("bio").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  altEmail: varchar("alt_email", { length: 255 }),
  phone: varchar("phone", { length: 40 }),
  photoUrl: text("photo_url"),
  cvUrl: text("cv_url"),
  scholarUrl: text("scholar_url"),
  institutionUrl: text("institution_url"),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  education: jsonb("education").$type<Education[]>().notNull().default([]),
  courses: jsonb("courses").$type<string[]>().notNull().default([]),
  stats: jsonb("stats").$type<ScholarStats>().notNull(),
  citationsByYear: jsonb("citations_by_year")
    .$type<{ year: number; count: number }[]>()
    .notNull()
    .default([]),
  ...timestamps,
});

export const publicationType = pgEnum("publication_type", [
  "journal",
  "book",
  "chapter",
  "conference",
  "patent",
  "other",
]);

export const publications = pgTable(
  "publications",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    title: text("title").notNull(),
    authors: text("authors").notNull(),
    venue: text("venue").notNull().default(""),
    publisher: varchar("publisher", { length: 255 }),
    volume: varchar("volume", { length: 40 }),
    issue: varchar("issue", { length: 40 }),
    pages: varchar("pages", { length: 40 }),
    year: integer("year"),
    publishedOn: varchar("published_on", { length: 40 }),
    type: publicationType("type").notNull().default("journal"),
    abstract: text("abstract"),
    doi: varchar("doi", { length: 255 }),
    url: text("url"),
    pdfUrl: text("pdf_url"),
    coverUrl: text("cover_url"),
    citations: integer("citations").notNull().default(0),
    scholarId: varchar("scholar_id", { length: 80 }).unique(),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("publications_year_idx").on(t.year), index("publications_type_idx").on(t.type)],
);

export const researchAreas = pgTable("research_areas", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull().default(""),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  funder: varchar("funder", { length: 200 }),
  amount: varchar("amount", { length: 60 }),
  role: varchar("role", { length: 80 }),
  status: varchar("status", { length: 40 }).notNull().default("ongoing"),
  period: varchar("period", { length: 60 }),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  date: date("date").notNull(),
  link: text("link"),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: varchar("issuer", { length: 200 }),
  year: varchar("year", { length: 20 }),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  affiliation: text("affiliation"),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  ...timestamps,
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull().unique(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mime: varchar("mime", { length: 120 }).notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  ...timestamps,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  ...timestamps,
});
