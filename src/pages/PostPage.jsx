import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { BASE_URL } from "@/lib/config";
import { usePublicPost } from "@/features/posts/hooks/usePublicPost";
import { usePublicPosts } from "@/features/posts/hooks/usePublicPosts";
import PostCard from "@/features/posts/components/PostCard";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";
import {
  editorContentToHtml,
  editorContentToText,
} from "@/features/posts/utils/editorContent";

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const readingTime = (content = "") => {
  const words = editorContentToText(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

function PostSkeleton() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="mt-6 h-16 max-w-3xl rounded bg-stone-200 dark:bg-stone-700" />
        <div className="mt-4 h-12 max-w-2xl rounded bg-stone-100 dark:bg-stone-800" />
        <div className="mt-8 h-5 w-64 rounded bg-stone-100 dark:bg-stone-800" />
        <div className="mt-10 aspect-[16/9] rounded-md bg-stone-100 dark:bg-stone-800" />
        <div className="mt-12 space-y-4">
          <div className="h-5 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="h-5 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="h-5 w-5/6 rounded bg-stone-100 dark:bg-stone-800" />
        </div>
      </div>
    </main>
  );
}

function AuthorCard({ post }) {
  const avatarSrc = post?.authorProfilePicture?.startsWith("http")
    ? post.authorProfilePicture
    : post?.authorProfilePicture
    ? `${BASE_URL}/api/images/${encodeURIComponent(post.authorProfilePicture)}`
    : null;

  return (
    <div className="mt-14 border-t border-stone-200 pt-10 dark:border-stone-700">
      <Link
        to={`/author/${post.authorId}`}
        className="group flex items-start gap-5"
      >
        <div className="shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={post.authorName}
              className="size-14 rounded-full object-cover transition group-hover:opacity-80"
              width={56}
              height={56}
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-stone-950 font-serif text-xl text-white transition group-hover:bg-rose-900 dark:bg-stone-800 dark:group-hover:bg-rose-900">
              {post?.authorName?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-500">
            Escrito por
          </p>
          <p className="mt-1 font-serif text-xl text-stone-950 transition group-hover:text-rose-800 dark:text-stone-50 dark:group-hover:text-rose-400">
            {post.authorName}
          </p>
          {post.authorDescription && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-400">
              {post.authorDescription}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-stone-500 transition group-hover:text-rose-700 dark:text-stone-400 dark:group-hover:text-rose-400">
            Ver más publicaciones →
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function PostPage() {
  const { slug } = useParams();
  const { post, loading, error, reload } = usePublicPost(slug);
  const { posts: allPosts } = usePublicPosts(0, 6);

  const author = post?.authorName ?? post?.AuthorName ?? "Autor";
  const category = post?.categoryName ?? post?.CategoryName ?? "Lectura";
  const imageSrc = post?.coverImage
    ? `${BASE_URL}/images/${encodeURIComponent(post.coverImage)}`
    : null;
  const isoDate = post?.createdAt ? new Date(post.createdAt).toISOString() : undefined;

  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.categoryName === post?.categoryName ||
          p.CategoryName === post?.CategoryName)
    )
    .slice(0, 3);

  const fallbackRelated = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const displayRelated = relatedPosts.length > 0 ? relatedPosts : fallbackRelated;

  return (
    <>
      <Navbar />
      {loading ? (
        <PostSkeleton />
      ) : error ? (
        <main id="main-content" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" aria-hidden="true" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950 dark:text-stone-50">
            No encontramos esta lectura
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
          <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-rose-800 dark:text-stone-400 dark:hover:text-rose-400"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver al archivo
            </Link>

            <header className="mt-10 border-b border-stone-200 pb-10 dark:border-stone-800">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-500">
                {post.categoryName && (
                  <Link
                    to={`/categoria/${post.categorySlug ?? post.categoryName?.toLowerCase()}`}
                    className="transition hover:text-rose-900 dark:hover:text-rose-300"
                  >
                    {category}
                  </Link>
                )}
                <span className="text-stone-300 dark:text-stone-600" aria-hidden="true">/</span>
                {isoDate ? (
                  <time dateTime={isoDate} className="text-stone-500 dark:text-stone-400">
                    {formatDate(post.createdAt)}
                  </time>
                ) : null}
                <span className="text-stone-300 dark:text-stone-600" aria-hidden="true">/</span>
                <span className="text-stone-400 dark:text-stone-500">
                  {readingTime(post.content)} min de lectura
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-none text-stone-950 sm:text-6xl dark:text-stone-50">
                {post.title}
              </h1>

              <p className="mt-6 text-sm font-medium text-stone-600 dark:text-stone-400">
                Escrito por{" "}
                <Link
                  to={`/author/${post.authorId}`}
                  className="text-stone-950 transition hover:text-rose-800 dark:text-stone-200 dark:hover:text-rose-400"
                >
                  {author}
                </Link>
              </p>
            </header>

            {imageSrc && (
              <figure className="mt-10 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-800">
                <img
                  src={imageSrc}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </figure>
            )}

            <div className="mx-auto mt-12 max-w-3xl">
              <div
                className="prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(editorContentToHtml(post.content)),
                }}
              />

              {post.authorId && <AuthorCard post={post} />}
            </div>
          </article>

          {displayRelated.length > 0 && (
            <section className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
              <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-500">
                    Continúa leyendo
                  </p>
                  <h2 className="mt-2 font-serif text-4xl text-stone-950 dark:text-stone-50">
                    Lecturas relacionadas
                  </h2>
                </div>
                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {displayRelated.map((p) => (
                    <PostCard key={p.slug} post={p} headingAs="h3" />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      )}
      <Footer />
    </>
  );
}
