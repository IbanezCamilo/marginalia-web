import { Link, useRouteError } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";

export default function ErrorPage() {
  const error = useRouteError();

  if (import.meta.env.DEV && error) {
    console.error(error);
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem-1px)] flex-col items-center justify-center bg-stone-50/40 px-5 py-24 text-center">
        <div className="mb-6 grid size-14 place-items-center rounded-md border border-stone-300 bg-stone-950 text-white">
          <AlertTriangle size={22} strokeWidth={1.6} />
        </div>

        <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">
          Algo salió mal
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-stone-500">
          Ocurrió un error inesperado al cargar esta página. Intenta volver al
          inicio o recarga la página en unos momentos.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
