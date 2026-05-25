import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { toCoverImageUrl } from "@/utils/imageUtils";
import PostCard from "@/features/posts/components/PostCard";
import { usePublicPosts } from "@/features/posts/hooks/usePublicPosts";
import CategoryBox from "../features/categories/components/CategoryBox";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";
import { editorContentToText } from "@/features/posts/utils/editorContent";

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const getExcerpt = (content, maxLength = 210) => {
  const text = editorContentToText(content);
  if (!text) return "Un texto para leer con calma, guardar y volver a visitar.";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

function HomeSkeleton() {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="animate-pulse border-b border-stone-200 pb-12 dark:border-stone-800">
        <div className="h-4 w-28 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="h-16 max-w-2xl rounded bg-stone-200 dark:bg-stone-700" />
            <div className="mt-4 h-16 max-w-xl rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-8 h-5 w-52 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
          <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
        </div>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-t border-stone-200 pt-5 dark:border-stone-800">
            <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
            <div className="mt-5 h-4 w-28 rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-4 h-8 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="mt-4 h-16 rounded bg-stone-100 dark:bg-stone-800" />
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
  const featuredImage = toCoverImageUrl(featuredPost?.coverImage);
  const featuredIsoDate = featuredPost?.createdAt
    ? new Date(featuredPost.createdAt).toISOString()
    : undefined;

  return (
    <>
      <Navbar />
      {postsLoading ? (
        <HomeSkeleton />
      ) : postsError ? (
        <main id="main-content" className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
          <BookOpen size={40} strokeWidth={1.5} className="text-rose-700" aria-hidden="true" />
          <h1 className="mt-6 font-serif text-4xl text-stone-950 dark:text-stone-50">
            No pudimos abrir la biblioteca
          </h1>
          <p className="mt-4 max-w-xl text-stone-600 dark:text-stone-400">{postsError}</p>
          <button
            type="button"
            onClick={reloadPosts}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reintentar
          </button>
        </main>
      ) : (
        <main id="main-content" className="bg-stone-50/40 dark:bg-stone-950">
          <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
            <div className="border-b border-stone-200 pb-10 dark:border-stone-800">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700 dark:text-rose-500">
                Marginalia
              </p>
              <div className="mt-5 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                <div>
                  <h1 className="max-w-4xl font-serif text-5xl leading-none text-stone-950 sm:text-6xl lg:text-7xl dark:text-stone-50">
                    Ideas que demandan tiempo en un mundo que corre.
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg dark:text-stone-400">
                    Una seleccion de publicaciones recientes, organizada para leer con calma y descubrir nuevas voces.
                  </p>
                </div>

                <div className="border-l border-stone-200 pl-6 text-sm leading-7 text-stone-600 dark:border-stone-700 dark:text-stone-400">
                  <p className="font-medium text-stone-950 dark:text-stone-100">
                    {totalElements} publicaciones disponibles
                  </p>
                  <p className="mt-2">
                    Un catálogo vivo que crece al ritmo de la buena escritura.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {posts.length === 0 ? (
            <section className="mx-auto flex min-h-[42vh] max-w-3xl flex-col items-center justify-center px-5 pb-20 text-center">
              <BookOpen size={42} strokeWidth={1.5} className="text-stone-400 dark:text-stone-600" aria-hidden="true" />
              <h2 className="mt-6 font-serif text-4xl text-stone-950 dark:text-stone-50">
                Aun no hay publicaciones
              </h2>
              <p className="mt-4 text-stone-600 dark:text-stone-400">
                Cuando un autor publique su primer texto, aparecera aqui como lectura destacada.
              </p>
            </section>
          ) : (
            <>
              <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
                <article className="grid gap-8 border-b border-stone-200 pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch dark:border-stone-800">
                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className="group order-2 flex flex-col justify-between lg:order-1"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-500">
                        <span>{featuredCategory}</span>
                        <span className="text-stone-300 dark:text-stone-600" aria-hidden="true">/</span>
                        {featuredIsoDate ? (
                          <time dateTime={featuredIsoDate} className="text-stone-500 dark:text-stone-400">
                            {formatDate(featuredPost.createdAt)}
                          </time>
                        ) : null}
                      </div>
                      <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-stone-950 transition-colors group-hover:text-rose-800 sm:text-5xl dark:text-stone-50 dark:group-hover:text-rose-400">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-400">
                        {getExcerpt(featuredPost.content)}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-stone-950 dark:text-stone-100">
                      Leer destacado
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-8 text-sm text-stone-500 dark:text-stone-400">
                      Por <span className="text-stone-900 dark:text-stone-200">{featuredAuthor}</span>
                    </p>
                  </Link>

                  <Link
                    to={`/post/${featuredPost.slug}`}
                    className="group order-1 overflow-hidden rounded-md bg-stone-100 lg:order-2 dark:bg-stone-800"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="aspect-[16/11]">
                      {featuredImage ? (
                        <img
                          src={featuredImage}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-400 dark:text-stone-600">
                          <BookOpen size={48} strokeWidth={1.4} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              </section>

              {secondaryPosts.length > 0 && (
                <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-500">
                      Archivo
                    </p>
                    <h2 className="mt-2 font-serif text-4xl text-stone-950 dark:text-stone-50">
                      Ultimas publicaciones
                    </h2>
                  </div>

                  <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                    {secondaryPosts.map((post) => (
                      <PostCard key={post.slug} post={post} headingAs="h3" />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <section
            id="categorias"
            className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <div className="mb-8 max-w-2xl">
                <h2 className="font-serif text-4xl text-stone-950 dark:text-stone-50">
                  Explora por temas
                </h2>
              </div>

              {categoriesLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-md border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800"
                    />
                  ))}
                </div>
              ) : categoriesError ? (
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  No pudimos cargar las categorias en este momento.
                </p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400">
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
