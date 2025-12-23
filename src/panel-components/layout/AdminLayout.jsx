import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

export default function AdminLayout() {
  return (
    <div>
      {/**SideBar Fijo*/}
      <SideBar />

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
