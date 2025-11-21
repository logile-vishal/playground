import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/core/services/auth.service";

const allowedRolesList: string[] = ['admin', 'user'];

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles = allowedRolesList }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading user...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !user.role.some(role => allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

  