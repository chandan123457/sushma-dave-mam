import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";

export const AUTH_COOKIE = "sd_admin";

export type AdminClaims = { sub: number; email: string; name: string };

declare global {
  namespace Express {
    interface Request {
      admin?: AdminClaims;
    }
  }
}

export function signToken(claims: AdminClaims): string {
  return jwt.sign(claims, env.jwtSecret, { expiresIn: "7d" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = req.cookies?.[AUTH_COOKIE] ?? (header?.startsWith("Bearer ") ? header.slice(7) : undefined);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const claims = jwt.verify(token, env.jwtSecret) as unknown as AdminClaims;
    req.admin = claims;
    next();
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
}
