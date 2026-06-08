import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — attach JWT on every call ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ht_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — auto-logout on 401 ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ht_token");
      localStorage.removeItem("ht_user");
      // Hard redirect so React state is fully cleared
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
