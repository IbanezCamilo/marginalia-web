import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "@/lib/apiClient";
import { usePublicPost } from "@/features/posts/hooks/usePublicPost";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";

const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

function PostSkeleton() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-stone-200" />
        <div className="mt-6 h-16 max-w-3xl rounded bg-stone-200" />
        <div className="mt-4 h-12 max-w-2xl rounded bg-stone-100" />
        <div className="mt-8 h-5 w-64 rounded bg-stone-100" />
        <div className="mt-10 aspect-[16/9] rounded-md bg-stone-100" />
        <div className="mt-12 space-y-4">
          <div className="h-5 rounded bg-stone-100" />
          <div className="h-5 rounded bg-stone-100" />
          <div className="h-5 w-5/6 rounded bg-stone-100" />
        </div>
      </div>
    </main>
  );
}

export default function PostPage() {
  const { slug } = useParams();
  const { post, loading, error, reload } = usePublicPost(slug);

  const author = post?.authorName ?? post?.AuthorName ?? "Autor";
  const category = post?.categoryName ?? post?.CategoryName ?? "Lectura";
  const imageSrc = post?.coverImage ? `${BASE_URL}/images/${post.coverImage}` : null;

  return (
    <>
      <Navbar />
      {loading ? (
        <PostSkeleton />
      ) : error ? (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950">
            No encontramos esta lectura
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
          <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800"
            >
              <ArrowLeft size={16} />
              Volver al archivo
            </Link>

            <header className="mt-10 border-b border-stone-200 pb-10">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                <span>{category}</span>
                <span className="text-stone-300">/</span>
                <time className="text-stone-500">{formatDate(post.createdAt)}</time>
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-none text-stone-950 sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 text-sm font-medium text-stone-600">
                Escrito por <span className="text-stone-950">{author}</span>
              </p>
            </header>

            {imageSrc && (
              <figure className="mt-10 overflow-hidden rounded-md bg-stone-100">
                <img
                  src={imageSrc}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </figure>
            )}

            <div className="mx-auto mt-12 max-w-3xl">
              <div
                className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:tracking-normal prose-h1:text-4xl prose-p:text-lg prose-p:leading-8 prose-a:text-rose-800 prose-blockquote:border-rose-700 prose-blockquote:bg-white prose-blockquote:px-6 prose-blockquote:py-2 prose-img:rounded-md"
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />
            </div>
          </article>
        </main>
      )}
      <Footer />
    </>
  );
}
