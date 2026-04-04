import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  List,
  Folder,
  Tag,
  Users,
  ChevronLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    { path: "/user/posts", icon: List, label: "Ver Posts" },
    { path: "/user/categories", icon: Folder, label: "Categorías" },
    { path: "/user/tags", icon: Tag, label: "Etiquetas" },
    { path: "/user/tags", icon: Tag, label: "Usuarios" },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 hidden md:block ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="h-16 flex items-center justify-center px-4 border-b-gray-200">
          {!isCollapsed && (
            <Link to="/" className="flex gap-2 items-center p-2">
              <img
                src="https://cdn-icons-png.flaticon.com/128/12244/12244828.png"
                className="w-8 h-8"
              ></img>
              <span className="font-semibold text-gray-700 ">
                Blog Literario
              </span>
            </Link>
          )}

          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors
            ${isCollapsed ? "mx-auto" : ""}`}
          >
            <ChevronLeft
              size={20}
              className={`text-gray-600 transition-transform duration-300 
              ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} className="flex shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/**Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 md_hidden transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/**Mobile Header*/}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/12244/12244828.png"
              className="w-8 h-8"
              alt="Logo"
            />
            <span className="font-semibold text-gray-700"></span>
          </Link>

          <Button
            variant="destructive"
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600"></X>
          </Button>
        </div>

        {/**Mobile Navegation */}
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                           ${
                             isActive
                               ? "bg-rose-50 text-rose-600"
                               : "text-gray-700 hover:bg-gray-100"
                           }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
