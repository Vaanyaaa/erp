"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken, clearToken, AppUser } from "@/lib/api";

interface AuthState {
  user: AppUser | null;
  /** True until the stored token has been checked against the server. */
  loading: boolean;
  login: (identifier: string, password: string) => Promise<AppUser>;
  register: (payload: Record<string, unknown>) => Promise<AppUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore the session on load so a refresh doesn't sign the user out.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await api<{ user: AppUser }>("/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        clearToken();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await api<{ token: string; user: AppUser }>("/auth/login", {
      method: "POST",
      body: { identifier, password },
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const data = await api<{ token: string; user: AppUser }>("/auth/register", {
      method: "POST",
      body: payload,
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}

/** Human-readable role label used across the dashboard. */
export function roleLabel(role?: string) {
  switch (role) {
    case "tp_admin":
      return "TP Cell";
    case "professor":
      return "Professor";
    case "parent":
      return "Parent";
    case "student":
      return "Student";
    default:
      return "—";
  }
}

/** Roles allowed to publish notices and calendar events. */
export function canPost(role?: string) {
  return role === "professor" || role === "tp_admin";
}
