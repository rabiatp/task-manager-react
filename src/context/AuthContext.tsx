import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../models/auth";
import { getMe } from "../services/auth";

type Ctx = {
  user: User | null;
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  loading: boolean;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const me = await getMe(token);
        if (alive) setUser(me);
      } catch (err: any) {
        console.error("getMe failed:", err?.message || err);
        // Sadece yetkisiz ise logout
        if (alive && String(err?.message).includes("getMe 401")) logout();
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
