import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PostCatalog from "@/features/posts/components/PostCatalog";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

function CategorySkeleton() {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="border-b border-stone-200 pb-10 dark:border-stone-800">
          <div className="h-4 w-28 rounded bg-stone-200 dark:bg-stone-700" />
          <div className="mt-4 h-12 w-72 rounded bg-stone-200 dark:bg-stone-700" />
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, loading, error, reload } = usePublicCategories();
  const category = categories.find((c) => c.slug === slug) ?? null;

  return (
    <>
      <Navbar />
      {loading ? (
        <CategorySkeleton />
      ) : error ? (
        <main id="main-content" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" aria-hidden="true" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950 dark:text-stone-50">
            Categoría no encontrada
          </h1>
          <p className="mt-4 max-w-xl text-stone-600 dark:text-stone-400">{error}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reload}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Reintentar
            </button>
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      ) : (
        <main id="main-content" className="bg-stone-50/40 dark:bg-stone-950">
          <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800 dark:text-stone-400 dark:hover:text-rose-400"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver al archivo
            </Link>

            <div className="mt-8 border-b border-stone-200 pb-10 dark:border-stone-800">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700 dark:text-rose-500">
                Categoría
              </p>
              <h1 className="mt-3 font-serif text-5xl text-stone-950 sm:text-6xl dark:text-stone-50">
                {category?.name ?? slug}
              </h1>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
            <PostCatalog lockedCategorySlug={slug} />
          </section>
        </main>
      )}
      <Footer />
    </>
  );
}
