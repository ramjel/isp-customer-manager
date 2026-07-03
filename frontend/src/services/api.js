import axios from "axios";

const api = axios.create({
  baseURL: "https://isp-backend-8xzm.onrender.com/api",
});

console.log("API IS USING:", api.defaults.baseURL);

export default api;
