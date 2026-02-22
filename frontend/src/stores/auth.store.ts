import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieUtils, COOKIE_NAMES } from "@/utils/cookies";

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string | null;
  garageId: string;
  garageName: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateAccessToken: (accessToken: string) => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        // Store access token in cookie (expires in 15 minutes)
        cookieUtils.setCookie(
          COOKIE_NAMES.ACCESS_TOKEN,
          accessToken,
          15 / (60 * 24)
        );
        set({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        cookieUtils.deleteCookie(COOKIE_NAMES.ACCESS_TOKEN);
        set({ user: null, isAuthenticated: false });
      },

      updateAccessToken: (accessToken) => {
        cookieUtils.setCookie(
          COOKIE_NAMES.ACCESS_TOKEN,
          accessToken,
          15 / (60 * 24)
        );
      },

      getAccessToken: () => {
        return cookieUtils.getCookie(COOKIE_NAMES.ACCESS_TOKEN);
      },
    }),
    {
      name: "motochatz-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
