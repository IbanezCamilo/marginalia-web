import { useAuth } from "@/features/auth/hooks/useAuth";
import { ReaderDashboard } from "../components/ReaderDashboard";
import { AuthorDashboard } from "../components/AuthorDashboard";
import { ModeratorDashboard } from "../components/ModeratorDashboard";
import { AdminDashboard } from "../components/AdminDashboard";
import { OwnerDashboard } from "../components/OwnerDashboard";

const ROLE_DASHBOARD = {
  AUTHOR: AuthorDashboard,
  MODERATOR: ModeratorDashboard,
  ADMIN: AdminDashboard,
  OWNER: OwnerDashboard,
};

export default function Dashboard() {
  const { state: { user: authUser } } = useAuth();

  if (authUser?.role === "READER") {
    return <ReaderDashboard user={authUser} />;
  }

  const RoleDashboard = ROLE_DASHBOARD[authUser?.role];
  if (!RoleDashboard) return null;

  return <RoleDashboard />;
}
