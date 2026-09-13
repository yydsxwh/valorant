"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PublicUser } from "@/lib/types";

type AuthCtx = {
  user: PublicUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: PublicUser | null;
}) {
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await res.json();
    setUser(data.user ?? null);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, refresh, logout }),
    [user, loading, refresh, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
