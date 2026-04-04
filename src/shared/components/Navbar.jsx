import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white border-gray-300 border-b shadow-sm">
            {/* --- LOGO + LINKS --- */}
            <div className="flex items-center gap-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/12244/12244828.png"
                        alt="Logo del blog"
                        className="w-9 h-9"
                    />
                    <span className="text-lg font-semibold text-gray-800 hover:text-rose-600 transition-colors">
                        Blog Literario
                    </span>
                </Link>

                {/* Enlaces principales */}
                <ul className="hidden md:flex gap-6 ml-4">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-gray-700 hover:text-rose-800 font-medium transition-colors ${isActive ? "underline underline-offset-4 text-rose-600" : ""}`
                            }
                        >
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/articulos"
                            className={({ isActive }) =>
                                `text-gray-700 hover:text-rose-800 font-medium transition-colors ${isActive ? "underline underline-offset-4 text-rose-600" : ""}`
                            }
                        >
                            Artículos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `text-gray-700 hover:text-rose-800 font-medium transition-colors ${isActive ? "underline underline-offset-4 text-rose-600" : ""}`
                            }
                        >
                            Acerca de
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* --- SEARCH + LOGIN --- */}
            <div className="flex items-center gap-5">
                {/* Botón de login */}
                <Link to="/auth/login">
                    <button
                        className="bg-rose-500 text-white font-medium px-4 py-1.5 rounded-full 
                                   hover:bg-rose-600 active:scale-95 transition-all shadow-sm
                                   cursor-pointer"
                    >
                        Iniciar sesión
                    </button>
                </Link>
            </div>
        </nav>
    )
}