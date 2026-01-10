import { Outlet } from "react-router-dom";
import { useState } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import SidebarCollapsible from "./SidebarCollapsible";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <div>
      {/**SideBar Fijo*/}
      {/**<SideBar />**/}

      <SidebarCollapsible isCollapsed={isCollapsed} onToggle={onToggle} />

      {/**Contenido Principal */}
      <div className="ml-60">
        <TopBar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
