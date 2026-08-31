// ---------------------------------------------------------------------------
// Centralized API client
//
// This is the ONE place that talks to the backend over HTTP. Every feature
// imports the exported `api` object and calls api.get / api.post / api.patch /
// api.put / api.delete. Keeping all HTTP logic here means the rest of the app
// never touches `fetch`, headers, or error shapes directly.
//
// Responsibilities:
//   - read the base URL from the environment
//   - attach the logged-in user's access token as a Bearer header
//   - send/parse JSON
//   - normalize every failure into a single ApiError shape
//   - log requests in development only
// ---------------------------------------------------------------------------

import { getAccessToken } from "./token";

// --- Types ------------------------------------------------------------------

export interface ApiErrorDetail {
  field: string;
  message: string;
}

// A single, predictable error type for the whole app. The UI can read
// `error.message` for a human-readable message and `error.status` to branch
// (e.g. 401 -> redirect to login).
export class ApiError extends Error {
  readonly status: number;
  readonly details?: ApiErrorDetail[];

  constructor(status: number, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  // Optional AbortController signal so a caller can cancel the request.
  signal?: AbortSignal;
}

// --- Configuration ----------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// --- Internal helpers -------------------------------------------------------

function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null; // e.g. 204 No Content
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeError(status: number, body: unknown): ApiError {
  // The backend sends { error: "..." } and sometimes { error, details: [...] }.
  if (body && typeof body === "object" && "error" in body) {
    const shaped = body as { error?: unknown; details?: unknown };
    const message =
      typeof shaped.error === "string" ? shaped.error : "Request failed";
    const details = Array.isArray(shaped.details)
      ? (shaped.details as ApiErrorDetail[])
      : undefined;
    return new ApiError(status, message, details);
  }
  return new ApiError(status, "Request failed");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: buildHeaders(hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });
  } catch {
    // fetch only rejects on network-level problems (server down, offline, CORS,
    // aborted). Turn that into our normal error shape too.
    throw new ApiError(0, "Network error. Please check your connection.");
  }

  const parsed = await parseResponseBody(response);

  if (!response.ok) {
    throw normalizeError(response.status, parsed);
  }

  return parsed as T;
}

// --- Public interface -------------------------------------------------------

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
