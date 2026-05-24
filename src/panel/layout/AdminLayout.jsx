import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import SidebarCollapsible from "./SidebarCollapsible";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isEditorPage =
    location.pathname === "/user/create-post" ||
    location.pathname.startsWith("/user/edit-post/");

  return (
    <div className="admin-shell min-h-screen bg-stone-50 text-stone-950">
      {!isEditorPage && (
        <SidebarCollapsible
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((value) => !value)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`m-0 transition-all duration-300 ${
          !isEditorPage && (isCollapsed ? "md:ml-16" : "md:ml-60")
        }`}
      >
        {!isEditorPage && (
          <TopBar onMenuClick={() => setIsMobileOpen(true)} />
        )}
        <main className={isEditorPage ? "p-0" : "px-4 py-5 sm:px-6 lg:px-8"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
