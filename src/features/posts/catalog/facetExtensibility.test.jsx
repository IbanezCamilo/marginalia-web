import { act, render, renderHook, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CATALOG_FACETS } from "./catalogFacets";
import CatalogFilterBar from "./CatalogFilterBar";
import { useCatalogFilters } from "./useCatalogFilters";

vi.mock(import("@/features/categories/hooks/usePublicCategories"), () => ({
  usePublicCategories: () => ({ categories: [], loading: false, error: null }),
}));

vi.mock(import("@/features/authors/hooks/usePublicAuthors"), () => ({
  usePublicAuthors: () => ({ authors: [], loading: false, error: null }),
}));

// A hypothetical future "tema" facet — ONE declarative entry, nothing else.
const topicFacet = {
  key: "topic",
  param: "topic",
  type: "select",
  label: "Tema",
  allLabel: "todos",
  defaultValue: null,
  clearable: true,
  useOptions: () => [{ value: "melancolia", label: "Melancolía" }],
  toApiParams: (value) => (value ? { topic: value } : {}),
};

const EXTENDED = [...CATALOG_FACETS, topicFacet];

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={["/catalog?topic=melancolia&time=short"]}>
    {children}
  </MemoryRouter>
);

describe("facet extensibility acid test", () => {
  it("a new registry entry gets URL parsing, apiParams, and clearAll for free", () => {
    const { result } = renderHook(() => useCatalogFilters({ facets: EXTENDED }), { wrapper });

    // URL parsing: generic
    expect(result.current.values.topic).toBe("melancolia");

    // apiParams: merged from the entry's pure toApiParams
    expect(result.current.apiParams).toMatchObject({ topic: "melancolia", time: "short" });

    // clearAll: generic (clearable flag)
    act(() => result.current.clearAll());
    expect(result.current.values.topic).toBeNull();
    expect(result.current.apiParams).not.toHaveProperty("topic");

    // setFacet: generic
    act(() => result.current.setFacet("topic", "melancolia"));
    expect(result.current.values.topic).toBe("melancolia");
  });

  it("the sentence renders the new facet with its own options, no component edits", () => {
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <CatalogFilterBar
          values={{ category: null, time: null, author: null, sort: "featured", q: "", topic: "melancolia" }}
          setFacet={() => {}}
          clearAll={() => {}}
          anyActive={true}
          locked={{}}
          facets={EXTENDED}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /tema/i })).toHaveTextContent("Melancolía");
  });
});
