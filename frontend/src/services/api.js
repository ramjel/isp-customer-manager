import axios from "axios";

const api = axios.create({
  baseURL: "https://isp-backend-8xzm.onrender.com/api",
});

// ✅ ALWAYS attach latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Optional: global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    console.error("API ERROR:", error.response?.data || error.message);

    return Promise.reject(error);
  },
);

console.log("API IS USING:", api.defaults.baseURL);

export default api;
