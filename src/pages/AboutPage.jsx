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
            Para quienes se atreven a escribir
          </h1>

          <img
            src={aboutIlustration}
            alt="Ilustración de un libro abierto con anotaciones, una taza de café, una pluma y una persona escribiendo"
            className="mt-10 w-full rounded-2xl"
          />

          <div className="mt-8 space-y-6 text-base leading-8 text-stone-600 text-justify dark:text-stone-400">
            <p>
              Marginalia nació de una carencia, no de una idea de negocio: la falta de
              plataformas pensadas para la escritura real y formal. Demasiados espacios
              tratan la escritura como contenido desechable — optimizado para el scroll,
              no para ser leído con atención. Quisimos algo distinto: un lugar donde
              quien se toma la escritura en serio encuentre, por fin, un espacio que la
              tome en serio también.
            </p>
            <p>
              Sabemos lo que significa publicar en otros lugares y sentir que la voz
              se diluye: entre algoritmos que premian lo viral por encima de lo bien
              escrito, plantillas que no distinguen un ensayo de un anuncio y
              comunidades donde lo formal apenas tiene lugar. Marginalia existe para
              ofrecer lo contrario: un espacio donde la escritura cuidada no sea una
              excepción, sino el punto de partida.
            </p>
            <p>
              Aquí se escribe y se lee con la misma intención: prestar atención.
              Marginalia es para quienes subrayan una frase y vuelven a ella días
              después, y para quienes escriben esperando encontrar al otro lado una
              lectura igual de cuidadosa. Porque leer y escribir, al final, comparten
              un mismo gesto: darle tiempo a las palabras.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
