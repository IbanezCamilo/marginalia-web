import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/apiClient";
import PostCard from "@/features/posts/components/PostCard";
import { usePublicPosts } from "@/features/posts/hooks/usePublicPosts";
import CategoryBox from "../features/categories/components/CategoryBox";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";
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

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (content, maxLength = 210) => {
  const text = stripHtml(content);
  if (!text) return "Un texto para leer con calma, guardar y volver a visitar.";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

function HomeSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="animate-pulse border-b border-stone-200 pb-12">
        <div className="h-4 w-28 rounded bg-stone-200" />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="h-16 max-w-2xl rounded bg-stone-200" />
            <div className="mt-4 h-16 max-w-xl rounded bg-stone-100" />
            <div className="mt-8 h-5 w-52 rounded bg-stone-100" />
          </div>
          <div className="aspect-[4/3] rounded-md bg-stone-100" />
        </div>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-t border-stone-200 pt-5">
            <div className="aspect-[4/3] rounded-md bg-stone-100" />
            <div className="mt-5 h-4 w-28 rounded bg-stone-100" />
            <div className="mt-4 h-8 rounded bg-stone-200" />
            <div className="mt-4 h-16 rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Homepage() {
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    totalElements,
    reload: reloadPosts,
  } = usePublicPosts(0, 10);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = usePublicCategories();

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);
  const featuredAuthor =
    featuredPost?.authorName ?? featuredPost?.AuthorName ?? "Autor";
  const featuredCategory =
    featuredPost?.categoryName ?? featuredPost?.CategoryName ?? "Lectura";
  const featuredImage = featuredPost?.coverImage
    ? `${BASE_URL}/images/${featuredPost.coverImage}`
    : null;

  return (
    <>
      <Navbar />
      {postsLoading ? (
        <HomeSkeleton />
      ) : postsError ? (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={40} strokeWidth={1.5} className="text-rose-700" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950">
            No pudimos abrir la biblioteca
          </h1>
          <p className="mt-4 max-w-xl text-stone-600">{postsError}</p>
          <button
            type="button"
            onClick={reloadPosts}
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </main>
      ) : (
        <main className="bg-stone-50/40">
          <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
            <div className="border-b border-stone-200 pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
                Blog Literario
              </p>
              <div className="mt-5 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                <div>
                  <h1 className="max-w-4xl font-serif text-5xl leading-none text-stone-950 sm:text-6xl lg:text-7xl">
                    Lecturas, autores y ensayos para volver a mirar la palabra.
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                    Una seleccion de publicaciones recientes, organizada para leer con calma y descubrir nuevas voces.
                  </p>
                </div>

                <div className="border-l border-stone-200 pl-6 text-sm leading-7 text-stone-600">
                  <p className="font-medium text-stone-950">
                    {totalElements} publicaciones disponibles
                  </p>
                  <p className="mt-2">
                    El archivo se actualiza con los textos publicados por los autores del blog.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {posts.length === 0 ? (
            <section className="mx-auto flex min-h-[42vh] max-w-3xl flex-col items-center justify-center px-5 pb-20 text-center">
              <BookOpen size={42} strokeWidth={1.5} className="text-stone-400" />
              <h2 className="mt-6 font-serif text-4xl text-stone-950">
                Aun no hay publicaciones
              </h2>
              <p className="mt-4 text-stone-600">
                Cuando un autor publique su primer texto, aparecera aqui como lectura destacada.
              </p>
            </section>
          ) : (
            <>
              <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
                <article className="grid gap-8 border-b border-stone-200 pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className="group order-2 flex flex-col justify-between lg:order-1"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                        <span>{featuredCategory}</span>
                        <span className="text-stone-300">/</span>
                        <time className="text-stone-500">
                          {formatDate(featuredPost.createdAt)}
                        </time>
                      </div>
                      <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-stone-950 transition-colors group-hover:text-rose-800 sm:text-5xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600">
                        {getExcerpt(featuredPost.content)}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-stone-950">
                      Leer destacado
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <p className="mt-8 text-sm text-stone-500">
                      Por <span className="text-stone-900">{featuredAuthor}</span>
                    </p>
                  </Link>

                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className="group order-1 overflow-hidden rounded-md bg-stone-100 lg:order-2"
                  >
                    <div className="aspect-[16/11]">
                      {featuredImage ? (
                        <img
                          src={featuredImage}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-400">
                          <BookOpen size={48} strokeWidth={1.4} />
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              </section>

              {secondaryPosts.length > 0 && (
                <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                        Archivo
                      </p>
                      <h2 className="mt-2 font-serif text-4xl text-stone-950">
                        Ultimas publicaciones
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                    {secondaryPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <section
            id="categorias"
            className="border-t border-stone-200 bg-white"
          >
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <div className="mb-8 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
                  Categorias
                </p>
                <h2 className="mt-2 font-serif text-4xl text-stone-950">
                  Explora por temas
                </h2>
              </div>

              {categoriesLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-md border border-stone-200 bg-stone-50"
                    />
                  ))}
                </div>
              ) : categoriesError ? (
                <p className="text-sm text-stone-500">
                  No pudimos cargar las categorias en este momento.
                </p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-stone-500">
                  Aun no hay categorias creadas.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {categories.map((category) => (
                    <CategoryBox
                      key={category.id ?? category.slug}
                      category={category}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}
      <Footer />
    </>
  );
}
