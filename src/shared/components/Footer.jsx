import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-300 dark:border-stone-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <Link to="/" className="font-serif text-2xl text-white">
            Marginalia
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-400">
            Un espacio dedicado al rescate de la lectura.
          </p>
        </div>

        <nav aria-label="Pie de página" className="flex flex-wrap gap-5 text-sm md:justify-end">
          <Link to="/" className="transition hover:text-white">
            Inicio
          </Link>
          <Link to="/#categorias" className="transition hover:text-white">
            Categorias
          </Link>
          <Link to="/auth/login" className="transition hover:text-white">
            Iniciar sesion
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl justify-between px-5 py-5 text-xs text-stone-500 sm:px-8">
          <p>Copyright 2026 Marginalia.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
