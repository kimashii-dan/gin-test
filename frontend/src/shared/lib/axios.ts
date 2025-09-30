import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { TokenResponse } from "../types";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }
  ) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post<TokenResponse>("/auth/refresh");
        const newToken = data.accessToken;
        localStorage.setItem("access_token", newToken);
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
