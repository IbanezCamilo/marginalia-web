import { describe, expect, it } from "vitest";
import { CATALOG_FACETS, SORT_LABELS, TIME_OPTIONS } from "./catalogFacets";

const facet = (key) => CATALOG_FACETS.find((f) => f.key === key);

describe("catalogFacets registry", () => {
  it("declares the facets in sentence order with search last", () => {
    expect(CATALOG_FACETS.map((f) => f.key)).toEqual([
      "category",
      "time",
      "author",
      "sort",
      "q",
    ]);
  });

  it("every facet satisfies the registry contract", () => {
    for (const f of CATALOG_FACETS) {
      expect(f.param, f.key).toBeTruthy();
      expect(typeof f.toApiParams, f.key).toBe("function");
      expect(typeof f.useOptions, f.key).toBe("function");
      expect(["select", "search"]).toContain(f.type);
      expect(f).toHaveProperty("defaultValue");
      expect(f).toHaveProperty("clearable");
    }
  });

  it("toApiParams passes values through purely and omits inactive facets", () => {
    expect(facet("category").toApiParams("ficcion")).toEqual({ category: "ficcion" });
    expect(facet("category").toApiParams(null)).toEqual({});
    expect(facet("time").toApiParams("short")).toEqual({ time: "short" });
    expect(facet("author").toApiParams("7")).toEqual({ authorId: "7" });
    expect(facet("q").toApiParams("  borges  ")).toEqual({ q: "borges" });
    expect(facet("q").toApiParams("a")).toEqual({}); // under min length
    expect(facet("sort").toApiParams("recent")).toEqual({ sort: "recent" });
    expect(facet("sort").toApiParams(null)).toEqual({ sort: "featured" });
  });

  it("sort facet normalizes legacy raw sort strings and rejects unknown values", () => {
    expect(facet("sort").normalize("createdAt,desc")).toBe("recent");
    expect(facet("sort").normalize("title_asc")).toBe("title_asc");
    expect(facet("sort").normalize("bogus")).toBeNull();
  });

  it("sort is not clearable; the rest are", () => {
    expect(facet("sort").clearable).toBe(false);
    for (const key of ["category", "time", "author", "q"]) {
      expect(facet(key).clearable, key).toBe(true);
    }
  });

  it("time options carry the editorial labels", () => {
    expect(TIME_OPTIONS).toEqual([
      { value: "short", label: "Un café" },
      { value: "medium", label: "Una pausa" },
      { value: "long", label: "Sobremesa" },
    ]);
    expect(Object.keys(SORT_LABELS)).toEqual([
      "featured",
      "recent",
      "oldest",
      "title_asc",
      "title_desc",
    ]);
  });
});
