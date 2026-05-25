import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePublicPostsByCategory } from "@/features/posts/hooks/usePublicPostsByCategory";
import PostCard from "@/features/posts/components/PostCard";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

function CategorySkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="border-b border-stone-200 pb-10">
          <div className="h-4 w-28 rounded bg-stone-200" />
          <div className="mt-4 h-12 w-72 rounded bg-stone-200" />
          <div className="mt-3 h-4 w-40 rounded bg-stone-100" />
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-t border-stone-200 pt-5">
              <div className="aspect-[4/3] rounded-md bg-stone-100" />
              <div className="mt-5 h-4 w-24 rounded bg-stone-100" />
              <div className="mt-3 h-6 rounded bg-stone-200" />
              <div className="mt-2 h-16 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const { category, posts, loading, error, totalElements, reload } =
    usePublicPostsByCategory(slug);

  return (
    <>
      <Navbar />
      {loading ? (
        <CategorySkeleton />
      ) : error ? (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950">
            Categoría no encontrada
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">{error}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reload}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      ) : (
        <main className="bg-stone-50/40">
          {/* Category header */}
          <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800"
            >
              <ArrowLeft size={16} />
              Volver al archivo
            </Link>

            <div className="mt-8 border-b border-stone-200 pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
                Categoría
              </p>
              <h1 className="mt-3 font-serif text-5xl text-stone-950 sm:text-6xl">
                {category?.name ?? slug}
              </h1>
              <p className="mt-4 text-sm text-stone-500">
                {totalElements}{" "}
                {totalElements === 1 ? "publicación" : "publicaciones"}
              </p>
            </div>
          </section>

          {/* Posts grid */}
          <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <BookOpen size={40} strokeWidth={1.5} className="text-stone-300" />
                <p className="mt-6 font-serif text-2xl text-stone-400">
                  No hay publicaciones en esta categoría todavía
                </p>
                <Link
                  to="/"
                  className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800"
                >
                  Explorar otras lecturas
                </Link>
              </div>
            ) : (
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}
      <Footer />
    </>
  );
}