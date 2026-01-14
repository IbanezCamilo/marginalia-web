import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { userService } from "../../data/userService";
import { Menu } from "lucide-react";

export default function TopBar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const defaultAvatar =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (!userService.isAuthenticated()) {
        navigate("/auth/login"); //Redirect to LOGIN
        return;
      }
      const data = await userService.getProfile();
      setUser({
        name: data.name,
        image: data.image || defaultAvatar,
      });
    } catch (err) {
      setError("Error al cargar datos del usuario: " + err.message);
      if (err.message.includes("sesion") || err.message.includes("401")) {
        navigate("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("¿Seguro quieres cerrar sesion?")) {
      userService.logout();
      navigate("/auth/login");
    }
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="flex justify-end items-center bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-xl transition">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <div className="flex-col p-2">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="flex justify-between items-center bg-white shadow-sm mb-2 p-2 h-16 border-b border-gray-200">
      <Button
        variant="secondary"
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <Menu size={20} className="text-gray-600" />
      </Button>
      <div className="flex-1 md:flex-none" />
      <div className="relative group cursor-pointer">
        {/*User y avatar*/}
        <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-xl transition">
          <img
            src={user?.image}
            className="w-12 h-12 object-cover rounded-full"
            onError={(e) => {
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";
            }}
          ></img>
          <span className="font-medium">{user?.name}</span>
        </div>
        {/* Menú desplegable */}
        <div
          className="absolute top-full right-0 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-lg 
                                opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                                pointer-events-none group-hover:pointer-events-auto transition-all duration-300 
                                ease-in-out"
        >
          <ul className="w-full flex flex-col gap-1 p-1">
            <Link
              to="profile"
              className="flex items-center w-full p-2 gap-2 rounded hover:bg-gray-200"
            >
              <CgProfile size={20} />
              <span>Perfil</span>
            </Link>
            <li className="flex items-center w-full p-2 gap-2 rounded hover:bg-gray-200">
              <CiSettings size={20} />
              <span>Configuración</span>
            </li>
            <li className="border-t border-gray-200 mt-1 pt-1">
              <Button
                onClick={handleLogout}
                className="flex items-center w-full p-2 gap-2 rounded hover:bg-red-100 text-red-600 text-left cursor-pointer"
              >
                <CiLogout size={20} />
                <span>Cerrar sesión</span>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
