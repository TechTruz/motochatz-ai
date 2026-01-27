import { apiClient } from "@/lib/api-client";
import type {
  User,
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
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
    email: "", // Email is not in the JWT, we'll need to store it separately
    firstName,
    lastName,
    garageId: payload.garageId,
    garageName: payload.garageName,
    role: payload.role,
  };
};

// API Service
export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/api/auth/register", data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", data);
  },
};
