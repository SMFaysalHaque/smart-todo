// Small helpers for storing the JWT access token in the browser.
//
// The token is kept in localStorage so it survives a page refresh. These
// helpers are SSR-safe: on the server there is no `window`, so they simply do
// nothing / return null instead of crashing.

const ACCESS_TOKEN_KEY = "smart-todo.accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
