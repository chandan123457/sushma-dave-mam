export type Metric = { all: number; recent: number };

export type Profile = {
  name: string;
  honorific: string;
  designation: string;
  department: string;
  institution: string;
  location: string;
  tagline: string;
  shortBio: string;
  bio: string;
  email: string;
  altEmail: string | null;
  phone: string | null;
  photoUrl: string | null;
  cvUrl: string | null;
  scholarUrl: string | null;
  institutionUrl: string | null;
  interests: string[];
  education: { degree: string; institution: string; year: string }[];
  courses: string[];
  stats: { citations: Metric; hIndex: Metric; i10Index: Metric; recentSince: number };
  citationsByYear: { year: number; count: number }[];
  updatedAt: string;
};

export const PUBLICATION_TYPES = ["journal", "book", "chapter", "conference", "patent", "other"] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export type Publication = {
  id: number;
  slug: string;
  title: string;
  authors: string;
  venue: string;
  publisher: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  year: number | null;
  publishedOn: string | null;
  type: PublicationType;
  abstract: string | null;
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
  coverUrl: string | null;
  citations: number;
  featured: boolean;
  published: boolean;
  updatedAt: string;
};

export type ResearchArea = {
  id: number;
  title: string;
  summary: string;
  description: string;
  keywords: string[];
  imageUrl: string | null;
  sortOrder: number;
  published: boolean;
};

export type Project = {
  id: number;
  title: string;
  funder: string | null;
  amount: string | null;
  role: string | null;
  status: "ongoing" | "completed";
  period: string | null;
  description: string | null;
  sortOrder: number;
  published: boolean;
};

export type NewsItem = { id: number; title: string; body: string | null; date: string; link: string | null; published: boolean };
export type Award = { id: number; title: string; issuer: string | null; year: string | null; description: string | null; sortOrder: number; published: boolean };
export type Collaborator = { id: number; name: string; affiliation: string | null; url: string | null; sortOrder: number; published: boolean };
export type Media = { id: number; filename: string; originalName: string; url: string; mime: string; size: number; createdAt: string };
export type Message = { id: number; name: string; email: string; subject: string | null; body: string; read: boolean; createdAt: string };

export const TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Journal article",
  book: "Book",
  chapter: "Book chapter",
  conference: "Conference",
  patent: "Patent",
  other: "Other",
};
