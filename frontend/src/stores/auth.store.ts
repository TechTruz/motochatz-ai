import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string | null;
  garageId: string;
  garageName: string;
  role: "USER" | "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  updateTokens: (tokens: AuthTokens) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => set({ user, tokens, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, tokens: null, isAuthenticated: false }),

      updateTokens: (tokens) => set((state) => ({ ...state, tokens })),
    }),
    {
      name: "motochatz-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
