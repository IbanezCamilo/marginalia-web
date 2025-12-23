import { CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <nav className="flex justify-end items-center bg-white shadow-sm mb-2 p-2">
      <div className="relative group cursor-pointer">
        {/*Username y avatar*/}
        <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-xl transition">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg"
            className="w-12 h-12 object-cover rounded-full"
          ></img>
          <span className="font-medium">Juan Perez</span>
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
            <li className="flex items-center w-full p-2 gap-2 rounded hover:bg-gray-200">
              <CiLogout size={20} />
              <span>Cerrar sesion</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
