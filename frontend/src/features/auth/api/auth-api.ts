import { api } from "@/lib/api-client";
import { type LoginResponse, type RegisterResponse } from "../types";


export function registerUser(email: string, password: string) {
  return api.post<RegisterResponse>("/auth/register", { email, password });
}

export function loginUser(email: string, password: string) {
  return api.post<LoginResponse>("/auth/login", { email, password });
}
