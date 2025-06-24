import Axios from "axios";

export const BASE_URL = "http://192.168.29.84:5000";

let axios = Axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
