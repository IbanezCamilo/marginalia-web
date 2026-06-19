import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ThemeToggle from "@/shared/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
    logout();
    navigate("/auth/login");
  };

  if (loading) {
    return (
      <div className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-border bg-background/90 px-4 backdrop-blur">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 rounded-md px-3 py-1">
            <div className="size-10 rounded-full bg-muted"></div>
            <div className="flex-col p-2">
              <div className="mb-1 h-4 w-32 rounded bg-muted"></div>
              <div className="h-4 w-20 rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onMenuClick}
        className="rounded-md md:hidden"
      >
        <Menu size={20} />
      </Button>

      <div className="hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
          Panel editorial
        </p>
        <p className="text-sm text-muted-foreground">
          Administra publicaciones, categorías y perfil.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {user?.image ? (
                <img
                  src={user.image}
                  className="size-10 rounded-full border border-border object-cover"
                  alt={user.name ?? "Usuario"}
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted font-serif text-base text-muted-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() ?? <UserRound size={18} />}
                </div>
              )}
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                {user?.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link to="profile" className="flex w-full cursor-pointer items-center gap-2">
                <UserRound size={17} />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2">
              <Settings size={17} />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-rose-700 focus:bg-rose-50 focus:text-rose-800 dark:text-rose-400 dark:focus:bg-rose-950 dark:focus:text-rose-400"
            >
              <LogOut size={17} />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
