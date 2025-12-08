import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/services/auth.service";
import CLoader from "@/core/components/loader/Loader";

const roleList: string[] = ["admin", "user"];

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = roleList,
}: ProtectedRouteProps) => {
  const { user, isLoading, isLoadingCache } = useAuth();
  const location = useLocation();
  const checkIfUserAllowed = () =>
    user && user.isAdmin && allowedRoles.includes("admin");

  // Only show loading on initial fetch, not on background refetches
  if (isLoading && !user && !isLoadingCache) {
    return <CLoader />;
  }

  if (!isLoading && !user) {
    // Not logged in, redirect to login
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!isLoading && !isLoadingCache && !checkIfUserAllowed()) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // Render children if provided, otherwise render Outlet for nested routes
  return <>{children}</>;
};
