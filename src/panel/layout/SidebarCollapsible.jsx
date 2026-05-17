import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Files,
  Folder,
  Home,
  LayoutDashboard,
  PenLine,
  PenSquare,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from  "@/shared/components/logo";

export default function SidebarCollapsible({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) {
  const location = useLocation();

  const menuItems = [
    { path: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/user/create-post", icon: PenSquare, label: "Crear Post" },
    { path: "/user/posts", icon: Files, label: "Mis Posts" },
    { path: "/user/categories", icon: Folder, label: "Categorias" },
    { path: "/user/profile", icon: UserRound, label: "Perfil" },
  ];

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
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-stone-950 text-white"
                : "text-stone-700 hover:bg-white hover:text-stone-950"
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
        className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-stone-200 bg-[#fbf8f3] transition-all duration-300 md:block ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-3">
          {!isCollapsed && (
            <Link to="/" className="group flex items-center gap-3 p-2">
              <span className="grid size-9 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white transition-colors group-hover:bg-rose-900">
                <Logo size={30}/>
              </span>
              <span className="font-serif text-xl text-stone-950">
                Marginalia
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={onToggle}
            className={`rounded-md p-1.5 text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-950 ${
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

        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-200 p-3">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-white hover:text-rose-800 ${
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
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-stone-200 bg-[#fbf8f3] transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white">
            <Logo size={30}/>
            </span>
            <span className="font-serif text-xl text-stone-950">
              Marginalia
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMobileClose}
            className="rounded-md text-stone-600 hover:bg-stone-200/70"
          >
            <X size={20} />
          </Button>
        </div>

        {renderMenu(onMobileClose)}
      </aside>
    </>
  );
}
