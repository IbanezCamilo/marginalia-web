import { useMemo } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import PostCard from "@/features/posts/components/PostCard";
import { CATALOG_FACETS } from "@/features/posts/catalog/catalogFacets";
import CatalogFilterBar from "@/features/posts/catalog/CatalogFilterBar";
import { useCatalogFilters } from "@/features/posts/catalog/useCatalogFilters";
import { useCatalogPosts } from "@/features/posts/hooks/useCatalogPosts";
import { PageError } from "@/shared/components/PageError";

function ResultsSkeleton() {
  return (
    <div className="mt-10 grid animate-pulse gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border-t border-stone-200 pt-5 dark:border-stone-700">
          <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="mt-5 h-4 w-24 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="mt-3 h-6 rounded bg-stone-200 dark:bg-stone-700" />
          <div className="mt-2 h-16 rounded bg-stone-100 dark:bg-stone-800" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ activeFacets, onRemoveFacet, onClearAll }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <BookOpen size={40} strokeWidth={1.5} className="text-stone-300 dark:text-stone-600" aria-hidden="true" />
      <p className="mt-6 font-serif text-2xl text-stone-400 dark:text-stone-500">
        No hay publicaciones con estos filtros todavía
      </p>
      {activeFacets.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {activeFacets.map((facet) => (
            <button
              key={facet.key}
              type="button"
              onClick={() => onRemoveFacet(facet.key, facet.defaultValue)}
              className="cursor-pointer text-sm text-stone-500 underline decoration-dotted underline-offset-4 transition hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-400"
            >
              Quitar {facet.label.toLowerCase()}
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-sm font-semibold text-stone-600 underline underline-offset-4 transition hover:text-rose-700 dark:text-stone-300 dark:hover:text-rose-400"
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function PostCatalog({ lockedCategorySlug = null }) {
  const locked = useMemo(
    () => (lockedCategorySlug ? { category: lockedCategorySlug } : {}),
    [lockedCategorySlug],
  );

  const { values, setFacet, clearAll, anyActive, apiParams } = useCatalogFilters({ locked });
  const { posts, loading, loadingMore, error, hasMore, totalElements, loadMore, reload } =
    useCatalogPosts({ apiParams, size: 12 });

  const activeFacets = CATALOG_FACETS.filter(
    (facet) =>
      facet.clearable && !(facet.key in locked) && values[facet.key] !== facet.defaultValue,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {loading ? "…" : `${totalElements} ${totalElements === 1 ? "publicación" : "publicaciones"}`}
        </p>

        <CatalogFilterBar
          values={values}
          setFacet={setFacet}
          clearAll={clearAll}
          anyActive={anyActive}
          locked={locked}
        />
      </div>

      {loading ? (
        <ResultsSkeleton />
      ) : error ? (
        <PageError
          tone="public"
          as="h2"
          icon={BookOpen}
          title="No pudimos cargar el catálogo"
          message={error}
          onRetry={reload}
          className="min-h-[40vh]"
        />
      ) : posts.length === 0 ? (
        <EmptyState activeFacets={activeFacets} onRemoveFacet={setFacet} onClearAll={clearAll} />
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
                Cargar más
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
