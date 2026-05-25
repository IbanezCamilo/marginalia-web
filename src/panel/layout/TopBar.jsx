import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e7e5e4'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23a8a29e'/%3E%3Cellipse cx='20' cy='36' rx='13' ry='10' fill='%23a8a29e'/%3E%3C/svg%3E";

export default function TopBar({ onMenuClick }) {
  const {
    state: { user, loading },
    actions: { logout },
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth/login");
  }, [loading, user, navigate]);

  const handleLogout = () => {
    if (confirm("Seguro quieres cerrar sesion?")) {
      logout();
      navigate("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-stone-200 bg-white/90 px-4 backdrop-blur">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 rounded-md px-3 py-1">
            <div className="size-10 rounded-full bg-stone-200"></div>
            <div className="flex-col p-2">
              <div className="mb-1 h-4 w-32 rounded bg-stone-200"></div>
              <div className="h-4 w-20 rounded bg-stone-100"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onMenuClick}
        className="rounded-md text-stone-600 hover:bg-stone-100 md:hidden"
      >
        <Menu size={20} />
      </Button>

      <div className="hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
          Panel editorial
        </p>
        <p className="text-sm text-stone-500">
          Administra publicaciones, categorias y perfil.
        </p>
      </div>

      <div className="group relative cursor-pointer">
        <div className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-stone-100">
          <img
            src={user?.image || DEFAULT_AVATAR}
            className="size-10 rounded-full border border-stone-200 object-cover"
            alt={user?.name ?? "Usuario"}
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <span className="hidden text-sm font-medium text-stone-800 sm:inline">
            {user?.name}
          </span>
        </div>

        <div className="pointer-events-none absolute right-0 top-full w-52 translate-y-2 rounded-md border border-stone-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-300 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <ul className="flex w-full flex-col gap-1 p-1">
            <Link
              to="profile"
              className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-stone-700 hover:bg-stone-100"
            >
              <UserRound size={17} />
              <span>Perfil</span>
            </Link>
            <li className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-stone-400">
              <Settings size={17} />
              <span>Configuracion</span>
            </li>
            <li className="mt-1 border-t border-stone-200 pt-1">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex w-full justify-start gap-2 rounded-md p-2 text-left text-sm text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <LogOut size={17} />
                <span>Cerrar sesion</span>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
