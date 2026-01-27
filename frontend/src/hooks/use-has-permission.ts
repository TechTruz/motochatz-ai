import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/stores/auth.store";

/**
 * Custom hook for checking user permissions
 * @param requiredRole - The role required to access the resource
 * @returns boolean indicating if user has the required permission
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const canAccess = useHasPermission('ADMIN');
 *
 *   if (!canAccess) {
 *     return <AccessDenied />;
 *   }
 *
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export function useHasPermission(requiredRole: User["role"]) {
  const user = useAuthStore((state) => state.user);

  if (requiredRole === "USER") {
    // USER role allows both USER and ADMIN
    return user?.role === "USER" || user?.role === "ADMIN";
  }

  // Exact role match for ADMIN
  return user?.role === requiredRole;
}
