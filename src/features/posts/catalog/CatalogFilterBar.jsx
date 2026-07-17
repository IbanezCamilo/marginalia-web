import { X } from "lucide-react";
import { CATALOG_FACETS } from "./catalogFacets";
import FacetControl from "./FacetControl";

/**
 * The catalog's filter state rendered as an editorial sentence:
 * "Categoría: Ficción · Tiempo: un café · Autor: todos · Orden: recientes · Buscar: _".
 * Maps generically over the facet registry — new facets appear here with zero edits.
 */
export default function CatalogFilterBar({
  values,
  setFacet,
  clearAll,
  anyActive,
  locked = {},
  facets = CATALOG_FACETS,
}) {
  const visibleFacets = facets.filter((facet) => !(facet.key in locked));

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      {visibleFacets.map((facet, index) => (
        <span key={facet.key} className="inline-flex items-center">
          {index > 0 ? (
            <span className="mx-1.5 text-stone-300 dark:text-stone-600" aria-hidden="true">
              ·
            </span>
          ) : null}
          <FacetControl
            facet={facet}
            value={values[facet.key]}
            onSelect={(...args) => setFacet(facet.key, ...args)}
          />
        </span>
      ))}

      {anyActive ? (
        <button
          type="button"
          onClick={clearAll}
          className="ml-3 inline-flex min-h-11 cursor-pointer items-center gap-1 px-1 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 transition hover:text-rose-700 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:outline-none dark:text-stone-500 dark:hover:text-rose-400"
        >
          <X size={12} aria-hidden="true" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
