import axios from "axios";
import { useAuthStore } from "../features/auth/auth.store";

let hasHandledUnauthorized = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    console.log("🔵 Axios token:", token); // 👈 add this
    console.log("🔵 Request URL:", config.url); // 👈 and this

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState();

    if (error.response?.status === 401) {
      if (!hasHandledUnauthorized) {
        hasHandledUnauthorized = true;
        console.warn("Unauthorized - Logging out...");
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;