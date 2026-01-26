import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { useEffect } from "react";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Anda perlu login dahulu untuk mengakses halaman ini");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
