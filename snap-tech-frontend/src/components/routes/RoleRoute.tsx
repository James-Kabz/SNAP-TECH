import { useAuth } from "@/context/UseAuth";
import { Navigate } from "react-router-dom";
interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, requiredRole }) => {
  const { hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};