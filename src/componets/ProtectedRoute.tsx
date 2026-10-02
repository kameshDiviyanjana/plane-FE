import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, isTokenValid } from "../api/tokenUtils";

interface ProtectedRouteProps {
  allowedRoles?: ("USER" | "ADMIN")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // Not logged in
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (allowedRoles) {
    const role = getUserRole();

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;