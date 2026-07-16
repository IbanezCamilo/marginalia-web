import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useCatalogFilters } from "./useCatalogFilters";

// Wrapper factory: initial URL + a probe to read the resulting search params.
const makeWrapper = (initialSearch = "") =>
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[`/catalog${initialSearch}`]}>{children}</MemoryRouter>
    );
  };

const useHarness = (options) => {
  const filters = useCatalogFilters(options);
  const [searchParams] = useSearchParams();
  return { filters, search: searchParams.toString() };
};

describe("useCatalogFilters", () => {
  it("reads facet values from the URL, applying defaults and normalization", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&sort=createdAt,desc"),
    });

    expect(result.current.filters.values.category).toBe("ficcion");
    expect(result.current.filters.values.time).toBe("short");
    expect(result.current.filters.values.sort).toBe("recent"); // legacy alias normalized
    expect(result.current.filters.values.author).toBeNull();
    expect(result.current.filters.values.q).toBe("");
  });

  it("unknown facet values fall back to defaults instead of breaking", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?time=bogus&sort=bogus"),
    });

    expect(result.current.filters.values.time).toBeNull();
    expect(result.current.filters.values.sort).toBe("featured");
  });

  it("setFacet writes to the URL and omits default values", () => {
    const { result } = renderHook(() => useHarness(), { wrapper: makeWrapper() });

    act(() => result.current.filters.setFacet("time", "long"));
    expect(result.current.search).toBe("time=long");

    act(() => result.current.filters.setFacet("time", null));
    expect(result.current.search).toBe("");
  });

  it("clearAll removes clearable facets but preserves sort", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&q=borges&sort=recent"),
    });

    expect(result.current.filters.anyActive).toBe(true);
    act(() => result.current.filters.clearAll());

    expect(result.current.search).toBe("sort=recent");
    expect(result.current.filters.anyActive).toBe(false);
  });

  it("locked facets have fixed values, are excluded from the URL and from clearAll", () => {
    const { result } = renderHook(
      () => useHarness({ locked: { category: "poesia" } }),
      { wrapper: makeWrapper("?category=ficcion&time=short") },
    );

    // locked value wins over whatever the URL says
    expect(result.current.filters.values.category).toBe("poesia");

    // setting a locked facet is a no-op
    act(() => result.current.filters.setFacet("category", "ficcion"));
    expect(result.current.filters.values.category).toBe("poesia");

    // clearAll keeps the locked value active
    act(() => result.current.filters.clearAll());
    expect(result.current.filters.values.category).toBe("poesia");
    expect(result.current.filters.apiParams.category).toBe("poesia");
  });

  it("apiParams merges every facet's pure toApiParams", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&author=7&q=borges"),
    });

    expect(result.current.filters.apiParams).toEqual({
      category: "ficcion",
      time: "short",
      authorId: "7",
      sort: "featured",
      q: "borges",
    });
  });

  it("explicit empty URL params count as inactive, not as empty-string values", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=&author=&q="),
    });

    expect(result.current.filters.values.category).toBeNull();
    expect(result.current.filters.values.author).toBeNull();
    expect(result.current.filters.values.q).toBe("");
    expect(result.current.filters.anyActive).toBe(false);
  });
});
