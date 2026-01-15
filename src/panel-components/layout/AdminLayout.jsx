import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import SidebarCollapsible from "./SidebarCollapsible";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const onToggle = () => setIsCollapsed(!isCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isCreatePostPage = location.pathname === "/user/create-post";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isCreatePostPage && (
        <SidebarCollapsible
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => {
            setIsMobileOpen(false);
          }}
        />
      )}

      {/**Contenido Principal */}
      <div
        className={`transition-all duration-300 ${
          !isCreatePostPage && (isCollapsed ? "md: ml-16" : "md:ml-60")
        }`}
      >
        {!isCreatePostPage && (
          <TopBar onMenuClick={() => setIsMobileOpen(true)} />
        )}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
