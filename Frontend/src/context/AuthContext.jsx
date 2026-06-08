import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";

const AuthContext = createContext(null);

// ─── Helpers — keep localStorage in sync ─────────────────────────────────────

function saveSession(token, user) {
  localStorage.setItem("ht_token", token);
  localStorage.setItem("ht_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("ht_token");
  localStorage.removeItem("ht_user");
}

function loadSession() {
  const token = localStorage.getItem("ht_token");
  const raw = localStorage.getItem("ht_user");
  try {
    return { token, user: raw ? JSON.parse(raw) : null };
  } catch {
    return { token: null, user: null };
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const { token: savedToken, user: savedUser } = loadSession();
  const [token, setToken] = useState(savedToken);
  const [user, setUser] = useState(savedUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (firstname, lastname, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister({ firstname, lastname, email, password });
      saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── useAuth hook — call anywhere inside the tree ─────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
