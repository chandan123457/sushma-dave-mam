# Dr. Sushma Dave — Research Portfolio

A research portfolio site for Dr. Sushma Dave (Professor of Chemistry, JIET Jodhpur), with an admin panel for managing every piece of content.

```
backend/    Express + TypeScript API · PostgreSQL · Drizzle ORM (schema + migrations)
frontend/   Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion
```

## Running locally

**1. Database** (PostgreSQL 17 in Docker, exposed on port **5434**)

```bash
cd backend && docker compose up -d
```

**2. API** (port 4000)

```bash
cd backend
npm install
npm run db:migrate   # apply migrations in backend/drizzle/
npm run db:seed      # admin user + Google Scholar content (safe to re-run)
npm run dev
```

**3. Website** (port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the admin panel.
The browser only talks to the Next.js server: `/backend/*` and `/uploads/*` are proxied to the API (see `frontend/next.config.ts`).

## Admin login

Credentials live in `backend/.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) and are created by `npm run db:seed`.
Change the password any time from **Admin → Account**.

## What the admin panel manages

| Section | What it controls |
| --- | --- |
| Profile & bio | Name, portrait, tagline, bio, education, courses, Scholar metrics, citation chart, contact links, CV |
| Publications | Papers, chapters, books — abstract, DOI, publisher link, PDF upload, cover image, featured/hidden |
| Research areas | Themes on the home and Research pages; keywords link each area to matching papers |
| Projects · News · Awards · Collaborators | Their respective sections on the site |
| Files & media | Upload PDFs / Word / images and copy links |
| Messages | Inbox for the website's contact form |

Every save refreshes the public pages immediately. Uploaded files are stored in Postgres, not on disk.

## Deploying

See [DEPLOY.md](DEPLOY.md) for Neon + Render (backend) + Vercel (frontend), including every environment variable.

## Database changes

Edit `backend/src/db/schema.ts`, then:

```bash
cd backend
npm run db:generate -- --name describe_change   # writes a new SQL migration in drizzle/
npm run db:migrate
```

## Content sources

- Publications, citation metrics, co-authors and research interests: [Google Scholar](https://scholar.google.com/citations?user=ZYqkgAoAAAAJ&hl=en), enriched with DOIs and publisher metadata from Crossref.
- Portrait, education, courses and contact details: [JIET faculty page](https://www.jietjodhpur.ac.in/mentor/dr-sushma-dave).
- 13 Scholar records that were duplicates or garbled imports are kept but hidden — filter **Publications → Status → Hidden** in admin to review them.
