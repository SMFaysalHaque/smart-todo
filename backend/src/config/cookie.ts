import { type CookieOptions } from "express";
import { env } from "./env.js";

export const REFRESH_COOKIE_NAME = "refreshToken";

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  path: "/auth",
};

export const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_TTL_MS,
};

export const clearRefreshCookieOptions: CookieOptions = baseCookieOptions;
