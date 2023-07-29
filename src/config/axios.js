import axios from "axios";

const axiosDriver = axios.create();
axiosDriver.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default axiosDriver;
