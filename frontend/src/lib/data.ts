import { cacheLife, cacheTag } from "next/cache";
import type { Award, Collaborator, NewsItem, Profile, Project, Publication, ResearchArea } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

/** Every public read shares one tag so a single admin save refreshes the whole site. */
export const CONTENT_TAG = "content";

async function get<T>(path: string): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CONTENT_TAG);
  const res = await fetch(`${API_URL}/api${path}`);
  if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

async function getOrNull<T>(path: string): Promise<T | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CONTENT_TAG);
  const res = await fetch(`${API_URL}/api${path}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

export const getProfile = () => get<Profile>("/profile");
export const getPublications = () => get<Publication[]>("/publications?sort=recent");
export const getPublication = (slug: string) => getOrNull<Publication>(`/publications/${encodeURIComponent(slug)}`);
export const getResearch = () => get<ResearchArea[]>("/research");
export const getProjects = () => get<Project[]>("/projects");
export const getNews = () => get<NewsItem[]>("/news");
export const getAwards = () => get<Award[]>("/awards");
export const getCollaborators = () => get<Collaborator[]>("/collaborators");
