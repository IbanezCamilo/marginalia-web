import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CATALOG_FACETS } from "./catalogFacets";

/**
 * Generic URL-synced state for the catalog facets. Iterates the registry — knows
 * nothing about any specific facet, so new facets need no changes here.
 *
 * `locked` pins facets to a fixed value (e.g. category on CategoryPage): a locked facet
 * ignores the URL, rejects setFacet, survives clearAll, and still contributes to
 * apiParams. Callers must pass a referentially stable object (useMemo it).
 * `facets` is injectable for tests only; production always uses CATALOG_FACETS.
 */
export function useCatalogFilters({ locked = {}, facets = CATALOG_FACETS } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = useMemo(() => {
    const result = {};
    for (const facet of facets) {
      if (facet.key in locked) {
        result[facet.key] = locked[facet.key];
        continue;
      }
      const raw = searchParams.get(facet.param);
      const present = raw != null && raw !== "";
      const normalized = present && facet.normalize ? facet.normalize(raw) : present ? raw : null;
      result[facet.key] = normalized ?? facet.defaultValue;
    }
    return result;
  }, [searchParams, locked, facets]);

  const setFacet = useCallback(
    (key, value, { replace = false } = {}) => {
      const facet = facets.find((f) => f.key === key);
      if (!facet || facet.key in locked) return;
      const next = new URLSearchParams(searchParams);
      if (value == null || value === "" || value === facet.defaultValue) {
        next.delete(facet.param);
      } else {
        next.set(facet.param, value);
      }
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams, locked, facets],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    for (const facet of facets) {
      if (facet.clearable && !(facet.key in locked)) {
        next.delete(facet.param);
      }
    }
    setSearchParams(next);
  }, [searchParams, setSearchParams, locked, facets]);

  const anyActive = useMemo(
    () =>
      facets.some(
        (facet) =>
          facet.clearable &&
          !(facet.key in locked) &&
          values[facet.key] !== facet.defaultValue,
      ),
    [values, locked, facets],
  );

  const apiParams = useMemo(() => {
    let params = {};
    for (const facet of facets) {
      params = { ...params, ...facet.toApiParams(values[facet.key]) };
    }
    return params;
  }, [values, facets]);

  return { values, setFacet, clearAll, anyActive, apiParams };
}
