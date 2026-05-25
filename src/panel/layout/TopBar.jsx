import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { userService } from "../../features/profile/services/userService";
import { LogOut, Menu, Settings, UserRound } from "lucide-react";

export default function TopBar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultAvatar =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!userService.isAuthenticated()) {
          navigate("/auth/login");
          return;
        }
        const data = await userService.getProfile();
        setUser({
          name: data.name,
          image: data.image || defaultAvatar,
        });
      } catch (err) {
        if (err.message.includes("sesion") || err.message.includes("401")) {
          navigate("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [defaultAvatar, navigate]);

  const handleLogout = () => {
    if (confirm("Seguro quieres cerrar sesion?")) {
      userService.logout();
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
            src={user?.image}
            className="size-10 rounded-full border border-stone-200 object-cover"
            alt={user?.name ?? "Usuario"}
            onError={(e) => {
              e.target.src = defaultAvatar;
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
