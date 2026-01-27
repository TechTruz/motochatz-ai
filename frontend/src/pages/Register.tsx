import { RegisterForm } from "@/components/RegisterForm";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAuthStore } from "@/stores/auth.store";
import { Navigate } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Register() {
  useDocumentTitle("Register");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initialAuthState = useRef(isAuthenticated);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (initialAuthState.current && !hasShownToast.current) {
      toast.info(
        "Anda sudah login. Silakan logout terlebih dahulu jika ingin membuat akun baru."
      );
      hasShownToast.current = true;
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/knowledge-base" replace />;
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
