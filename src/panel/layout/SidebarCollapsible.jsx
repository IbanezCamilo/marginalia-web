import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  ChevronLeft,
  ClipboardList,
  Files,
  Folder,
  Home,
  LayoutDashboard,
  PenSquare,
  ShieldCheck,
  UserCog,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/shared/components/Logo";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LEVEL } from "@/utils/roles";

const ALL_MENU_ITEMS = [
  { path: "/user/author-request", icon: BadgeCheck,     label: "Ser Autor",  minRole: "READER", maxRole: "READER" },
  { path: "/user/dashboard",      icon: LayoutDashboard, label: "Dashboard",  minRole: "AUTHOR" },
  { path: "/user/create-post",    icon: PenSquare,       label: "Crear Post", minRole: "AUTHOR" },
  { path: "/user/posts",          icon: Files,           label: "Mis Posts",  minRole: "AUTHOR" },
  { path: "/user/moderacion",     icon: ShieldCheck,     label: "Moderación",  minRole: "MODERATOR" },
  { path: "/user/categories",     icon: Folder,          label: "Categorías",  minRole: "ADMIN"  },
  { path: "/user/solicitudes",    icon: ClipboardList,   label: "Solicitudes", minRole: "ADMIN"  },
  { path: "/user/usuarios",       icon: UserCog,         label: "Usuarios",    minRole: "ADMIN"  },
  { path: "/user/profile",        icon: UserRound,       label: "Perfil",      minRole: "READER" },
];

export default function SidebarCollapsible({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) {
  const location = useLocation();
  const { state: { user } } = useAuth();

  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    if (!user?.role) return false;
    const userLevel = ROLE_LEVEL[user.role] ?? 0;
    const min = ROLE_LEVEL[item.minRole] ?? 0;
    const max = item.maxRole != null ? ROLE_LEVEL[item.maxRole] ?? 0 : Infinity;
    return userLevel >= min && userLevel <= max;
  });

  const renderMenu = (onClick) => (
    <nav className="space-y-1 p-3">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? "bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950"
                : "text-stone-700 hover:bg-white hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <Icon size={19} className="shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-stone-200 dark:border-stone-800 bg-surface-warm transition-all duration-300 md:block ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 dark:border-stone-800 px-3">
          {!isCollapsed && (
            <Link to="/" className="group flex items-center gap-2 p-2">
              <Logo size={40} className="shrink-0 text-[#be163d] transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400" />
              <span className="font-serif text-xl text-[#be163d] transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400">
                Marginalia
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={onToggle}
            className={`rounded-md p-1.5 text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 ${
              isCollapsed ? "mx-auto" : ""
            }`}
            aria-label={isCollapsed ? "Expandir menu" : "Contraer menu"}
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {renderMenu()}

        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-200 dark:border-stone-800 p-3">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-white hover:text-rose-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-rose-400 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Ver sitio" : ""}
          >
            <Home size={18} />
            {!isCollapsed && <span>Ver sitio</span>}
          </Link>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-stone-200 dark:border-stone-800 bg-surface-warm transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 dark:border-stone-800 px-4">
          <Link to="/" className="group flex items-center gap-2">
            <Logo size={40} className="shrink-0 text-[#be163d] transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400" />
            <span className="font-serif text-xl text-[#be163d] transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400">
              Marginalia
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMobileClose}
            className="rounded-md text-stone-600 hover:bg-stone-200/70 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            <X size={20} />
          </Button>
        </div>

        {renderMenu(onMobileClose)}
      </aside>
    </>
  );
}
