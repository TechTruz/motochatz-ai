import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import {
  authService,
  type RegisterRequest,
  type LoginRequest,
  getUserFromToken,
} from "@/services/auth.service";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success("Registration successful! Please login to continue.");
      navigate("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response, variables) => {
      const { accessToken, refreshToken } = response.data;
      const user = getUserFromToken(accessToken);

      // Store email from login request since it's not in the JWT
      user.email = variables.email;

      setAuth(user, { accessToken, refreshToken });
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };
};
