import { Link } from "react-router-dom";
import { LogOut, PenSquare, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AccountMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-2 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-100 dark:hover:text-stone-950"
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? "Usuario"}
              className="size-7 rounded-full border border-stone-300 object-cover dark:border-stone-600"
            />
          ) : (
            <div className="flex size-7 items-center justify-center rounded-full border border-stone-300 bg-stone-100 font-serif text-sm text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {user?.name?.charAt(0)?.toUpperCase() ?? <UserRound size={14} />}
            </div>
          )}
          <span className="hidden sm:inline">{user?.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/user/dashboard" className="flex w-full cursor-pointer items-center gap-2">
            <PenSquare size={17} />
            <span>Escribir</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/user/profile" className="flex w-full cursor-pointer items-center gap-2">
            <UserRound size={17} />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="gap-2 text-rose-700 focus:bg-rose-50 focus:text-rose-800"
        >
          <LogOut size={17} />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
