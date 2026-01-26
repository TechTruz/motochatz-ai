import { apiClient } from "@/lib/api-client";
import type { User, AuthTokens } from "@/stores/auth.store";

// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string | null;
  garageName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response types
export interface RegisterResponse {
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string | null;
    garageId: string;
    garageName: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginResponse {
  data: AuthTokens;
}

// JWT Payload type
export interface JWTPayload {
  jti: string;
  sub: string; // user's id
  name: string; // user's full name
  role: "USER" | "ADMIN";
  garageId: string;
  garageName: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

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

  // Split name into firstName and lastName
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
