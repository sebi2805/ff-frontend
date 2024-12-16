import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "./cookies";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = getCookie("access-token");
    if (token) {
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        if (config.headers instanceof AxiosHeaders) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
