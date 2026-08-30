import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

const BEARER_PREFIX = "Bearer ";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();
  const userId = verifyAccessToken(token);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  req.user = { id: userId };
  next();
}
