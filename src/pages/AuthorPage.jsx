import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "@/lib/apiClient";
import { usePublicAuthor } from "@/features/authors/hooks/usePublicAuthor";
import PostCard from "@/features/posts/components/PostCard";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

function AuthorSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="flex items-start gap-8 border-b border-stone-200 pb-12">
          <div className="size-28 shrink-0 rounded-full bg-stone-200" />
          <div className="flex-1">
            <div className="h-10 w-64 rounded bg-stone-200" />
            <div className="mt-3 h-4 w-32 rounded bg-stone-100" />
            <div className="mt-6 h-16 w-full max-w-lg rounded bg-stone-100" />
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-t border-stone-200 pt-5">
              <div className="aspect-[4/3] rounded-md bg-stone-100" />
              <div className="mt-5 h-4 w-28 rounded bg-stone-100" />
              <div className="mt-3 h-6 rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AuthorPage() {
  const { authorId } = useParams();
  const { author, posts, loading, error, reload } = usePublicAuthor(authorId);

  const avatarSrc = author?.profilePicture?.startsWith("http")
    ? author.profilePicture
    : author?.profilePicture
    ? `${BASE_URL}/api/images/${author.profilePicture}`
    : null;

  return (
    <>
      <Navbar />
      {loading ? (
        <AuthorSkeleton />
      ) : error ? (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950">
            No encontramos a este autor
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
          {/* Author header */}
          <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800"
            >
              <ArrowLeft size={16} />
              Volver al archivo
            </Link>

            <div className="mt-8 flex flex-col items-start gap-8 border-b border-stone-200 pb-12 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={author.name}
                    className="size-28 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-full border-4 border-white bg-stone-950 text-3xl font-serif text-white shadow-md">
                    {author?.name?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                  Autor
                </p>
                <h1 className="mt-2 font-serif text-4xl text-stone-950 sm:text-5xl">
                  {author?.name}
                </h1>
                {author?.description && (
                  <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                    {author.description}
                  </p>
                )}
                <p className="mt-4 text-sm text-stone-400">
                  {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"}
                </p>
              </div>
            </div>
          </section>

          {/* Articles grid */}
          <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <BookOpen size={40} strokeWidth={1.5} className="text-stone-300" />
                <p className="mt-6 font-serif text-2xl text-stone-400">
                  Aún no hay publicaciones de este autor
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                    Publicaciones
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-stone-950">
                    Escritos de {author?.name}
                  </h2>
                </div>
                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post.slug} post={post} hideAuthor />
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      )}
      <Footer />
    </>
  );
}