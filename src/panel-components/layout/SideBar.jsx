import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { RiListView } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLabel } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import Homepage from "../../pages/Homepage";

export default function SideBar() {
  return (
    <div className="w-60 h-screen fixed bg-white border-r border-gray-200 shadow-md p-4 flex flex-col justify-start">
      {/*Nombre y logo*/}
      <div className="h-16 flex items-center p-2 mb-12">
        <Link to={"/"} className="flex justify-between items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/128/12244/12244828.png"
            className="w-8 h-8"
          ></img>
          <span>Blog-Literario</span>
        </Link>
      </div>
      <ul className="w-full flex flex-col gap-4">
        <li className="w-full">
          <Link
            to="/user/dashboard"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <MdDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            to="/user/create-post"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <MdOutlinePostAdd size={20} />
            <span>Crear Post</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            to="/user/posts"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <RiListView size={20} />
            <span>Ver Posts</span>
          </Link>
        </li>
        <li className="w-full">
          <Link
            to="/user/categories"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <BiCategoryAlt size={20} />
            <span>Categorias</span>
          </Link>
        </li>
        <li className="w-full">
          <a
            href="#"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <MdOutlineLabel size={20} />
            <span>Etiquetas</span>
          </a>
        </li>
        <li className="w-full">
          <a
            href="#"
            className="flex items-center w-full p-2 gap-3 rounded hover:bg-gray-200"
          >
            <FaRegUser size={20} />
            <span>Usuarios</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
