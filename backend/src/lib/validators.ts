import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v ? v : null));

export const publicationInput = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().optional(),
  authors: z.string().trim().min(1),
  venue: z.string().trim().default(""),
  publisher: optionalText,
  volume: optionalText,
  issue: optionalText,
  pages: optionalText,
  year: z.coerce.number().int().min(1900).max(2100).nullish(),
  publishedOn: optionalText,
  type: z.enum(["journal", "book", "chapter", "conference", "patent", "other"]).default("journal"),
  abstract: optionalText,
  doi: optionalText,
  url: optionalText,
  pdfUrl: optionalText,
  coverUrl: optionalText,
  citations: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const researchAreaInput = z.object({
  title: z.string().trim().min(2),
  summary: z.string().trim().min(2),
  description: z.string().trim().default(""),
  keywords: z.array(z.string().trim()).default([]),
  imageUrl: optionalText,
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const projectInput = z.object({
  title: z.string().trim().min(2),
  funder: optionalText,
  amount: optionalText,
  role: optionalText,
  status: z.enum(["ongoing", "completed"]).default("ongoing"),
  period: optionalText,
  description: optionalText,
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const newsInput = z.object({
  title: z.string().trim().min(2),
  body: optionalText,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  link: optionalText,
  published: z.boolean().default(true),
});

export const awardInput = z.object({
  title: z.string().trim().min(2),
  issuer: optionalText,
  year: optionalText,
  description: optionalText,
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const collaboratorInput = z.object({
  name: z.string().trim().min(2),
  affiliation: optionalText,
  url: optionalText,
  sortOrder: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

const metric = z.object({ all: z.coerce.number().int().min(0), recent: z.coerce.number().int().min(0) });

export const profileInput = z.object({
  name: z.string().trim().min(2),
  honorific: z.string().trim().default("Dr."),
  designation: z.string().trim().min(2),
  department: z.string().trim().min(2),
  institution: z.string().trim().min(2),
  location: z.string().trim().min(2),
  tagline: z.string().trim().min(2),
  shortBio: z.string().trim().min(2),
  bio: z.string().trim().min(2),
  email: z.string().trim().email(),
  altEmail: optionalText,
  phone: optionalText,
  photoUrl: optionalText,
  cvUrl: optionalText,
  scholarUrl: optionalText,
  institutionUrl: optionalText,
  interests: z.array(z.string().trim().min(1)),
  education: z.array(z.object({ degree: z.string(), institution: z.string(), year: z.string() })),
  courses: z.array(z.string().trim().min(1)),
  stats: z.object({
    citations: metric,
    hIndex: metric,
    i10Index: metric,
    recentSince: z.coerce.number().int(),
  }),
  citationsByYear: z.array(z.object({ year: z.coerce.number().int(), count: z.coerce.number().int().min(0) })),
});

export const messageInput = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  subject: optionalText,
  body: z.string().trim().min(5).max(5000),
});

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const passwordInput = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Use at least 8 characters"),
});
