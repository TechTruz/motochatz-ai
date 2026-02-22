import { apiClient } from "@/lib/api-client";
import { authenticatedApiClient } from "@/lib/authenticated-api-client";
import type {
  User,
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  JWTPayload,
} from "@/types/auth.types";

export type { RegisterRequest, LoginRequest };

// Helper function to decode JWT
export const decodeJWT = (token: string): JWTPayload => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error("Invalid token");
  }
};

// Helper function to extract user from JWT
export const getUserFromToken = (accessToken: string): User => {
  const payload = decodeJWT(accessToken);

  const nameParts = payload.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

  return {
    userId: payload.sub,
    email: "",
    firstName,
    lastName,
    garageId: payload.garageId,
    garageName: payload.garageName,
    role: payload.role,
  };
};

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/api/auth/register", data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", data);
  },

  async refresh(): Promise<RefreshResponse> {
    return apiClient.get<RefreshResponse>("/api/auth/refresh");
  },

  async logout(): Promise<void> {
    return authenticatedApiClient.delete<void>("/api/auth/token");
  },
};
