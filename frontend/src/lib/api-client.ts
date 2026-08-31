
import { getAccessToken } from "./token";


export interface ApiErrorDetail {
  field: string;
  message: string;
}

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
  signal?: AbortSignal;
}


const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(
  /\/+$/,
  "",
);

const BASE_URL =
  configuredBaseUrl ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");


function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeError(status: number, body: unknown): ApiError {
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
    throw new ApiError(0, "Network error. Please check your connection.");
  }

  const parsed = await parseResponseBody(response);

  if (!response.ok) {
    throw normalizeError(response.status, parsed);
  }

  return parsed as T;
}


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
