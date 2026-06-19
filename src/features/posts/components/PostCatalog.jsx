import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import PostCard from "@/features/posts/components/PostCard";
import { useCatalogPosts } from "@/features/posts/hooks/useCatalogPosts";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SORT_LABELS = {
  "createdAt,desc": "Mas recientes",
  "createdAt,asc": "Mas antiguas",
  "title,asc": "Titulo A-Z",
  "title,desc": "Titulo Z-A",
};

const DEFAULT_SORT = "createdAt,desc";

function FilterTrigger({ children }) {
  return (
    <DropdownMenuTrigger className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-400">
      {children}
      <ChevronDown size={14} aria-hidden="true" />
    </DropdownMenuTrigger>
  );
}

function PostCatalogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-40 rounded-md bg-stone-100 dark:bg-stone-800" />
        <div className="h-10 w-40 rounded-md bg-stone-100 dark:bg-stone-800" />
      </div>
      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border-t border-stone-200 pt-5 dark:border-stone-700">
            <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
            <div className="mt-5 h-4 w-24 rounded bg-stone-100 dark:bg-stone-800" />
            <div className="mt-3 h-6 rounded bg-stone-200 dark:bg-stone-700" />
            <div className="mt-2 h-16 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostCatalog({ lockedCategorySlug = null }) {
  const isLocked = Boolean(lockedCategorySlug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [lockedSort, setLockedSort] = useState(DEFAULT_SORT);

  const { categories } = usePublicCategories();

  const categorySlug = isLocked ? lockedCategorySlug : searchParams.get("category");
  const sort = isLocked ? lockedSort : searchParams.get("sort") ?? DEFAULT_SORT;

  const selectedCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug) ?? null,
    [categories, categorySlug],
  );
  const categoryId = selectedCategory?.id ?? null;

  const { posts, loading, loadingMore, error, hasMore, totalElements, loadMore, reload } =
    useCatalogPosts({ categoryId, sort, size: 12 });

  function handleCategorySelect(slug) {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }
    setSearchParams(next);
  }

  function handleSortSelect(value) {
    if (isLocked) {
      setLockedSort(value);
      return;
    }
    const next = new URLSearchParams(searchParams);
    if (value === DEFAULT_SORT) {
      next.delete("sort");
    } else {
      next.set("sort", value);
    }
    setSearchParams(next);
  }

  if (loading) {
    return <PostCatalogSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" aria-hidden="true" />
        <h2 className="mt-6 font-serif text-3xl text-stone-950 dark:text-stone-50">
          No pudimos cargar el catálogo
        </h2>
        <p className="mt-4 max-w-xl text-stone-600 dark:text-stone-400">{error}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {totalElements} {totalElements === 1 ? "publicacion" : "publicaciones"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {!isLocked && (
            <DropdownMenu>
              <FilterTrigger>{selectedCategory?.name ?? "Todas las categorias"}</FilterTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleCategorySelect(null)}>
                  Todas las categorias
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id ?? category.slug}
                    onSelect={() => handleCategorySelect(category.slug)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <FilterTrigger>{SORT_LABELS[sort]}</FilterTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <DropdownMenuItem key={value} onSelect={() => handleSortSelect(value)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <BookOpen size={40} strokeWidth={1.5} className="text-stone-300 dark:text-stone-600" aria-hidden="true" />
          <p className="mt-6 font-serif text-2xl text-stone-400 dark:text-stone-500">
            No hay publicaciones con estos filtros todavia
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-5 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white disabled:opacity-60 dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-100 dark:hover:text-stone-950"
              >
                {loadingMore ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : null}
                Cargar mas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
