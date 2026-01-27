export type UserRole = "USER" | "ADMIN";

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string | null;
  garageId: string;
  garageName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  jti: string;
  sub: string; // user's id
  name: string; // user's full name
  role: UserRole;
  garageId: string;
  garageName: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

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

export interface ApiError {
  message: string;
  context?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  errors: ApiError[];
}
