import { Link, NavLink } from "react-router-dom";
import { LogIn, PenLine } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white">
              <PenLine size={18} strokeWidth={1.8} />
            </span>
            <span className="font-serif text-xl text-stone-950 transition-colors group-hover:text-rose-800">
              Blog Literario
            </span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-rose-800"
                      : "text-stone-600 hover:text-stone-950"
                  }`
                }
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <Link
                to="/#categorias"
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
              >
                Categorias
              </Link>
            </li>
          </ul>
        </div>

        <Link
          to="/auth/login"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
        >
          <LogIn size={16} />
          <span className="hidden sm:inline">Iniciar sesion</span>
        </Link>
      </nav>
    </header>
  );
}
