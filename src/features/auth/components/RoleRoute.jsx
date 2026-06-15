import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LEVEL } from "@/utils/roles";

export default function RoleRoute({ minRole }) {
  const { state: { user, loading } } = useAuth();

  if (loading) return null;

  const userLevel = ROLE_LEVEL[user?.role] ?? 0;
  const requiredLevel = ROLE_LEVEL[minRole] ?? 0;

  return userLevel >= requiredLevel ? <Outlet /> : <Navigate to="/user/dashboard" replace />;
}
