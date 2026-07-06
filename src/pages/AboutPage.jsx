import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import aboutIlustration from "@/assets/about-ilustration.webp";
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

          <img
            src={aboutIlustration}
            alt="Ilustración de un libro abierto con anotaciones, una taza de café, una pluma y una persona escribiendo"
            className="mt-10 w-full rounded-2xl"
          />

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
      </main>
      <Footer />
    </>
  );
}
