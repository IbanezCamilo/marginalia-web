import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, Moon, PenSquare, Sun, UserRound, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Logo from "./logo";
import AccountMenu from "./AccountMenu";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-md border border-stone-200 text-stone-600 transition hover:border-stone-400 hover:text-stone-950 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:text-stone-100"
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const {
    state: { user, loading },
    actions: { logout },
  } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-stone-950"
      >
        Ir al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
        <nav
          aria-label="Principal"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white dark:border-stone-600 dark:bg-stone-800">
                <Logo size={30} aria-hidden="true" />
              </span>
              <span className="font-serif text-xl text-stone-950 transition-colors group-hover:text-rose-800 dark:text-stone-50 dark:group-hover:text-rose-400">
                Marginalia
              </span>
            </Link>

            <ul className="hidden items-center gap-6 md:flex">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-rose-800 dark:text-rose-400"
                        : "text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                    }`
                  }
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <Link
                  to="/#categorias"
                  className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100"
                >
                  Categorias
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {loading ? (
              <div className="h-11 w-11 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800 sm:w-24" />
            ) : user ? (
              <AccountMenu user={user} onLogout={handleLogout} />
            ) : (
              <Link
                to="/auth/login"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-100 dark:hover:text-stone-950"
              >
                <LogIn size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Iniciar sesion</span>
              </Link>
            )}

            <button
              type="button"
              aria-label="Abrir menu de navegacion"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="grid size-11 place-items-center rounded-md text-stone-600 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 md:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegacion"
        >
          <div
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            aria-label="Menu movil"
            className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl dark:bg-stone-950"
          >
            <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5 dark:border-stone-800">
              <span className="font-serif text-lg text-stone-950 dark:text-stone-50">
                Marginalia
              </span>
              <button
                type="button"
                aria-label="Cerrar menu"
                onClick={() => setMobileOpen(false)}
                className="grid size-9 place-items-center rounded-md text-stone-600 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-col p-4 gap-1">
              <li>
                <NavLink
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-stone-100 text-rose-800 dark:bg-stone-800 dark:text-rose-400"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                    }`
                  }
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <Link
                  to="/#categorias"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                >
                  Categorias
                </Link>
              </li>
            </ul>

            <div className="mt-auto border-t border-stone-200 p-4 dark:border-stone-800">
              {loading ? null : user ? (
                <div className="flex flex-col gap-1">
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                  >
                    <PenSquare size={16} aria-hidden="true" />
                    Escribir
                  </Link>
                  <Link
                    to="/user/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                  >
                    <UserRound size={16} aria-hidden="true" />
                    Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 text-sm font-semibold text-white transition hover:bg-rose-900 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 text-sm font-semibold text-white transition hover:bg-rose-900 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
                >
                  <LogIn size={16} aria-hidden="true" />
                  Iniciar sesion
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
