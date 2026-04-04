

export default function Footer(){
    return(
        <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm">&copy; 2025 Blog_Literario. Todos los derechos Reservados.</p>
                <div className="text-sm mt-4 flex justify-center space-x-4">
                    <a href="#" className="hover:underline underline-offset-2">Inicio</a>
                    <a href="#" className="hover:underline underline-offset-2">Acerca de</a>
                </div>
            </div>
        </footer>
    )
}