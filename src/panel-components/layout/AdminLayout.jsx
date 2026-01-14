import { Outlet } from "react-router-dom";
import { useState } from "react";
import TopBar from "./TopBar";
import SidebarCollapsible from "./SidebarCollapsible";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onToggle = () => setIsCollapsed(!isCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarCollapsible
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => {
          setIsMobileOpen(false);
        }}
      />

      {/**Contenido Principal */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "md: ml-16" : "md:ml-60"
        }`}
      >
        <TopBar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
