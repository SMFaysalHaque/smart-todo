import { api } from "@/lib/api-client";
import { type LoginResponse, type RegisterResponse } from "../types";

// Thin, named wrappers around the generic API client so the UI reads clearly
// (loginUser(...) instead of api.post("/auth/login", ...)).

export function registerUser(email: string, password: string) {
  return api.post<RegisterResponse>("/auth/register", { email, password });
}

export function loginUser(email: string, password: string) {
  return api.post<LoginResponse>("/auth/login", { email, password });
}
