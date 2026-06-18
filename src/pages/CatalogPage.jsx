import PostCatalog from "@/features/posts/components/PostCatalog";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

export default function CatalogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-stone-50/40 dark:bg-stone-950">
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700 dark:text-rose-500">
            Catálogo
          </p>
          <h1 className="mt-3 font-serif text-5xl text-stone-950 sm:text-6xl dark:text-stone-50">
            Todas las publicaciones
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">
            Filtra por categoria y orden para encontrar tu proxima lectura.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <PostCatalog />
        </section>
      </main>
      <Footer />
    </>
  );
}
