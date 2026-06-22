import { ArrowLeft, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePublicAuthor } from "@/features/authors/hooks/usePublicAuthor";
import PostCard from "@/features/posts/components/PostCard";
import { PageError } from "@/shared/components/PageError";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

function AuthorSkeleton() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="flex items-start gap-8 border-b border-stone-200 pb-12 dark:border-stone-800">
          <div className="size-28 shrink-0 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div className="flex-1">
            <div className="h-10 w-64 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="mt-3 h-4 w-32 rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-6 h-16 w-full max-w-lg rounded bg-stone-100 dark:bg-stone-800" />
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-t border-stone-200 pt-5 dark:border-stone-700">
              <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
              <div className="mt-5 h-4 w-28 rounded bg-stone-100 dark:bg-stone-800" />
              <div className="mt-3 h-6 rounded bg-stone-200 dark:bg-stone-700" />
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

  const avatarSrc = author?.profilePicture;

  return (
    <>
      <Navbar />
      {loading ? (
        <AuthorSkeleton />
      ) : error ? (
        <main id="main-content">
          <PageError
            tone="public"
            icon={BookOpen}
            title="No encontramos a este autor"
            message={error}
            onRetry={reload}
            secondaryAction={{ label: "Volver al inicio", to: "/" }}
          />
        </main>
      ) : (
        <main id="main-content" className="bg-stone-50/40 dark:bg-stone-950">
          <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800 dark:text-stone-400 dark:hover:text-rose-400"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver al archivo
            </Link>

            <div className="mt-8 flex flex-col items-start gap-8 border-b border-stone-200 pb-12 sm:flex-row sm:items-center dark:border-stone-800">
              <div className="shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={author.name}
                    className="size-28 rounded-full border-4 border-white object-cover shadow-md dark:border-stone-800"
                    width={112}
                    height={112}
                  />
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-full border-4 border-white bg-stone-950 font-serif text-3xl text-white shadow-md dark:border-stone-800 dark:bg-stone-800">
                    {author?.name?.charAt(0)?.toUpperCase() ?? "A"}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-500">
                  Autor
                </p>
                <h1 className="mt-2 font-serif text-4xl text-stone-950 sm:text-5xl dark:text-stone-50">
                  {author?.name}
                </h1>
                {author?.description && (
                  <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-400">
                    {author.description}
                  </p>
                )}
                <p className="mt-4 text-sm text-stone-400 dark:text-stone-500">
                  {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"}
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <BookOpen size={40} strokeWidth={1.5} className="text-stone-300 dark:text-stone-600" aria-hidden="true" />
                <p className="mt-6 font-serif text-2xl text-stone-400 dark:text-stone-500">
                  Aún no hay publicaciones de este autor
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-stone-950 dark:text-stone-50">
                    Escritos de {author?.name}
                  </h2>
                </div>
                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post.slug} post={post} hideAuthor headingAs="h3" />
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
