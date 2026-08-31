"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api-client";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/token";
import { type AuthUser } from "@/features/auth/types";


interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (accessToken: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get<{ user: AuthUser }>("/auth/me")
      .then((response) => setUser(response.user))
      .catch(() => clearAccessToken())
      .finally(() => setIsLoading(false));
  }, []);

  function login(accessToken: string, nextUser: AuthUser): void {
    setAccessToken(accessToken);
    setUser(nextUser);
  }

  async function logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
    }
    clearAccessToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
