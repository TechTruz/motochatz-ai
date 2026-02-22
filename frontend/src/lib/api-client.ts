import axios, { type AxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.errors?.[0]?.message) {
      throw new Error(error.response.data.errors[0].message);
    }
    throw new Error(error.message || "An error occurred");
  }
);

export const apiClient = {
  async request<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  },

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint, config);
    return response.data;
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(endpoint, config);
    return response.data;
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  },
};
