import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload === "object" && typeof payload.sub === "string") {
      return payload.sub;
    }
    return null;
  } catch {
    return null;
  }
}
