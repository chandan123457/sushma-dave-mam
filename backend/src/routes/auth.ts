import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/http.js";
import { loginInput, passwordInput } from "../lib/validators.js";
import { AUTH_COOKIE, requireAdmin, signToken } from "../middleware/auth.js";

export const authRouter = Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.isProd,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Naive in-memory throttle: 8 failed attempts per email per 15 minutes.
const failures = new Map<string, { count: number; until: number }>();

authRouter.post("/login", async (req, res) => {
  const { email, password } = loginInput.parse(req.body);
  const lock = failures.get(email);
  if (lock && lock.count >= 8 && lock.until > Date.now()) {
    throw new HttpError(429, "Too many attempts. Try again in a few minutes.");
  }

  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email));
  const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!ok) {
    const prev = failures.get(email);
    failures.set(email, { count: (prev?.count ?? 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    throw new HttpError(401, "Incorrect email or password");
  }
  failures.delete(email);

  const token = signToken({ sub: admin.id, email: admin.email, name: admin.name });
  res.cookie(AUTH_COOKIE, token, cookieOptions);
  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions, maxAge: undefined });
  res.status(204).end();
});

authRouter.get("/me", requireAdmin, (req, res) => {
  const { sub, email, name } = req.admin!;
  res.json({ admin: { id: sub, email, name } });
});

authRouter.post("/password", requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = passwordInput.parse(req.body);
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.id, req.admin!.sub));
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    throw new HttpError(400, "Current password is incorrect");
  }
  await db
    .update(schema.admins)
    .set({ passwordHash: await bcrypt.hash(newPassword, 12) })
    .where(eq(schema.admins.id, admin.id));
  res.status(204).end();
});
