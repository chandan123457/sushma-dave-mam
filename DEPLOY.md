# Deploying

- **Database:** Neon Postgres (already migrated and seeded)
- **Backend:** Render (`backend/`)
- **Frontend:** Vercel (`frontend/`)

Deploy the **backend first**. Vercel's build fetches content from the API to prerender pages, so the API must already be live.

The browser only ever talks to Vercel. Vercel proxies `/backend/*` and `/uploads/*` to Render, so login cookies are first-party and no CORS setup is needed.

## 1. Backend on Render (Web Service)

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm run db:migrate && npm start` |
| Health Check Path | `/api/health` |

Environment variables:

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Your Neon connection string (`postgresql://…neon.tech/neondb?sslmode=require&channel_binding=require`) |
| `JWT_SECRET` | A long random string, e.g. the output of `openssl rand -hex 32` |
| `NODE_ENV` | `production` |
| `FRONTEND_ORIGIN` | Your Vercel URL, e.g. `https://sushma-dave.vercel.app` |
| `ADMIN_EMAIL` | `admin@sushmadave.in` (only used by `npm run db:seed`) |
| `ADMIN_PASSWORD` | The admin password (only used by `npm run db:seed`) |
| `ADMIN_NAME` | `Dr. Sushma Dave` (only used by `npm run db:seed`) |

Render sets `PORT` itself. Don't add it.

`npm run db:migrate` runs on every start and applies any new migrations in `backend/drizzle/`. It does nothing if the database is already up to date.

## 2. Frontend on Vercel

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `frontend` |

Environment variable (tick Production, Preview and Development):

| Key | Value |
| --- | --- |
| `API_URL` | Your Render URL, without a trailing slash, e.g. `https://sushma-dave-api.onrender.com` |

`API_URL` is read at **build time** for the proxy rules. If you change it, redeploy.

## Notes

- **Uploaded files** (PDFs, photos, CV) are stored in Postgres, so they survive Render redeploys and restarts.
- **Render free plan** sleeps after ~15 minutes idle; the first request then takes ~30–50 s.
  - Visitors still see cached pages from Vercel. Only admin actions wait for the wake-up.
  - Before redeploying Vercel, open `https://<render-url>/api/health` once so the build doesn't hit a sleeping API.
- **Changing the admin password:** use Admin → Account. `ADMIN_PASSWORD` is only read by the seed script when creating the admin, so editing it on Render later changes nothing.
- **Schema changes:** edit `backend/src/db/schema.ts`, run `npm run db:generate -- --name <change>` locally, commit the new file in `backend/drizzle/`, and push. Render applies it on the next start.
