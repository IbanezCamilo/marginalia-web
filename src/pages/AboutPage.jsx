import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-stone-50/40 dark:bg-stone-950">
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800 dark:text-stone-400 dark:hover:text-rose-400"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al archivo
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-rose-700 dark:text-rose-500">
            Sobre Marginalia
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-tight text-stone-950 sm:text-6xl dark:text-stone-50">
            Un lugar para leer con calma
          </h1>

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600 dark:text-stone-400">
            <p>
              Marginalia nació de una idea simple: la lectura merece un espacio que no
              compita por tu atención. Nada de ventanas que interrumpen, nada de
              contadores que premian la prisa. Aquí el texto manda: el diseño existe
              para que las palabras se lean bien, no para llamar la atención sobre sí
              mismo.
            </p>
            <p>
              Escribimos y leemos con la misma intención. Si eres de quienes subraya
              frases y vuelve a ellas días después, este sitio está pensado para ti.
              Si escribes, esperamos que sientas la misma calidez en el editor que un
              lector siente en la pantalla.
            </p>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
            <h2 className="font-serif text-3xl text-stone-950 dark:text-stone-50">
              Quién está detrás
            </h2>

            <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-stone-950 font-serif text-2xl text-white shadow-md dark:border-stone-800 dark:bg-stone-800">
                N
              </div>
              <div>
                <h3 className="font-serif text-2xl text-stone-950 dark:text-stone-50">
                  [Nombre del fundador]
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-stone-600 dark:text-stone-400">
                  [Bio del fundador — dos o tres frases sobre su relación con la
                  escritura y por qué creó Marginalia.]
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
