import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth.js";

export default function PrivateRoute() {
  const { state: { user, loading } } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
