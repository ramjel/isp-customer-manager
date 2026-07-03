import axios from "axios";

const api = axios.create({
  baseURL: "https://isp-backend-8xzm.onrender.com/api",
});

// ALWAYS attach latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); // DEBUG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
