import axios from "axios";

const api = axios.create({
  baseURL: "https://isp-backend-8xzm.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR (clean + safe)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // only attach if exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR (clean session reset)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    console.error("API ERROR:", err.response?.data || err.message);

    const requestUrl = err.config?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    // Expired/invalid token on protected routes — not failed login attempts
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
