import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function SidebarCollapsible({ isCollapsed, onToggle }) {
  return (
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
            <span className="font-semibold text-gray-700 ">Blog Literario</span>
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
        <nav></nav>
      </div>
    </aside>
  );
}
