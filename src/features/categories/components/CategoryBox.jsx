import { Link } from "react-router-dom";

export default function CategoryBox({ nombre }) {
    return (
        <Link className="group flex flex-col items-center justify-center gap-2 p-6 h-min-16 rounded-xl shadow-sm
                        bg-white hover:shadow-md transition-all duration-300 hover:scale-[1.03]">
            {/**Contenedor de la imagen */}
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-gray-300
                            rounded-full transition-colors duration-300">
                <img src="" className="w-full h-full object-cover"></img>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">{nombre}</span>
        </Link>
    )
}