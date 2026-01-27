import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authenticatedAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authenticatedAxiosInstance.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.errors?.[0]?.message) {
      throw new Error(error.response.data.errors[0].message);
    }
    throw new Error(error.message || "An error occurred");
  }
);

export const authenticatedApiClient = {
  async request<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await authenticatedAxiosInstance.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  },

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await authenticatedAxiosInstance.get<T>(endpoint, config);
    return response.data;
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await authenticatedAxiosInstance.post<T>(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await authenticatedAxiosInstance.put<T>(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await authenticatedAxiosInstance.delete<T>(
      endpoint,
      config
    );
    return response.data;
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await authenticatedAxiosInstance.patch<T>(
      endpoint,
      data,
      config
    );
    return response.data;
  },
};
