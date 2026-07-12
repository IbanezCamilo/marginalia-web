import { Link } from "react-router-dom";
import { PenLine, ArrowLeft } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

export default function NotFoundPage() {
  // useRouteError captures both route errors (404) and data-loading errors
  // (loaders). If there is no route error (component used directly), it simply
  // shows the 404.
  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem-1px)] flex-col items-center justify-center bg-stone-50/40 px-5 py-24 text-center">
        <p className="font-serif text-[9rem] font-bold leading-none text-stone-100 select-none sm:text-[12rem]">
          404
        </p>

        <div className="-mt-10 mb-6 grid size-14 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white sm:-mt-14">
          <PenLine size={22} strokeWidth={1.6} />
        </div>

        <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">
          Página no encontrada
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-stone-500">
          La lectura que buscas no existe o fue movida. Puede que el enlace
          esté desactualizado o simplemente que hayas llegado a una página en
          blanco del archivo.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          <Link
            to="/#categorias"
            className="inline-flex h-10 items-center rounded-md border border-stone-300 px-5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            Explorar categorías
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}