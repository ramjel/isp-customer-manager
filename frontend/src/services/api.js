import axios from "axios";

const api = axios.create({
  baseURL: "https://isp-backend-8xzm.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function isPublicAuthRoute(url = "") {
  return url.includes("/auth/login") || url.includes("/auth/register");
}

function isSessionCheckRoute(url = "") {
  return url.includes("/auth/me");
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const requestUrl = err.config?.url || "";
    const isExpectedAuthFailure =
      isPublicAuthRoute(requestUrl) || isSessionCheckRoute(requestUrl);

    if (!isExpectedAuthFailure) {
      console.error("API ERROR:", err.response?.data || err.message);
    }

    if (status === 401 && !isExpectedAuthFailure) {
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
