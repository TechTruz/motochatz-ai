import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";

interface ApiErrorResponse {
  errors?: Array<{
    message: string;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authenticatedAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

authenticatedAxiosInstance.interceptors.request.use(
  (config) => {
    const { getAccessToken } = useAuthStore.getState();
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return authenticatedAxiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
          withCredentials: true,
        });

        const { accessToken } = response.data.data;

        const { updateAccessToken } = useAuthStore.getState();
        updateAccessToken(accessToken);

        processQueue(null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return authenticatedAxiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
