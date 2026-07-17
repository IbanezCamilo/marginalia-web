import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CatalogFilterBar from "./CatalogFilterBar";

vi.mock(import("@/features/categories/hooks/usePublicCategories"), () => ({
  usePublicCategories: () => ({
    categories: [{ id: 1, name: "Ficción", slug: "ficcion" }],
    loading: false,
    error: null,
  }),
}));

vi.mock(import("@/features/authors/hooks/usePublicAuthors"), () => ({
  usePublicAuthors: () => ({
    authors: [{ id: 7, name: "Alice Munro" }],
    loading: false,
    error: null,
  }),
}));

const baseValues = { category: null, time: null, author: null, sort: "featured", q: "" };

const renderBar = (props = {}) => {
  const setFacet = vi.fn();
  const clearAll = vi.fn();
  render(
    <CatalogFilterBar
      values={baseValues}
      setFacet={setFacet}
      clearAll={clearAll}
      anyActive={false}
      locked={{}}
      {...props}
    />,
  );
  return { setFacet, clearAll };
};

describe("CatalogFilterBar", () => {
  it("renders the sentence with 'all' labels when nothing is active", () => {
    renderBar();

    expect(screen.getByRole("button", { name: /categoría/i })).toHaveTextContent("todas");
    expect(screen.getByRole("button", { name: /tiempo/i })).toHaveTextContent("cualquiera");
    expect(screen.getByRole("button", { name: /autor/i })).toHaveTextContent("todos");
    expect(screen.getByRole("button", { name: /orden/i })).toHaveTextContent("Destacados");
    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument();
  });

  it("shows the active option label in the trigger, resolved from the facet's options", () => {
    renderBar({ values: { ...baseValues, category: "ficcion", time: "short", author: "7" } });

    expect(screen.getByRole("button", { name: /categoría/i })).toHaveTextContent("Ficción");
    expect(screen.getByRole("button", { name: /tiempo/i })).toHaveTextContent("Un café");
    expect(screen.getByRole("button", { name: /autor/i })).toHaveTextContent("Alice Munro");
  });

  it("selecting an option calls setFacet with the facet key and value", async () => {
    const user = userEvent.setup();
    const { setFacet } = renderBar();

    await user.click(screen.getByRole("button", { name: /tiempo/i }));
    await user.click(await screen.findByRole("menuitem", { name: "Un café" }));

    expect(setFacet).toHaveBeenCalledWith("time", "short");
  });

  it("hides locked facets from the sentence", () => {
    renderBar({ locked: { category: "ficcion" } });

    expect(screen.queryByRole("button", { name: /categoría/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tiempo/i })).toBeInTheDocument();
  });

  it("shows 'Limpiar filtros' only when a filter is active, and wires it to clearAll", async () => {
    const user = userEvent.setup();
    renderBar();
    expect(screen.queryByRole("button", { name: /limpiar filtros/i })).not.toBeInTheDocument();

    const { clearAll } = renderBar({ anyActive: true });
    await user.click(screen.getAllByRole("button", { name: /limpiar filtros/i })[0]);
    expect(clearAll).toHaveBeenCalled();
  });

  it("debounces search input before committing to setFacet with replace", async () => {
    const user = userEvent.setup();
    const { setFacet } = renderBar();

    await user.type(screen.getByLabelText(/buscar/i), "borges");
    expect(setFacet).not.toHaveBeenCalled(); // not yet — debounced

    await waitFor(
      () => expect(setFacet).toHaveBeenCalledWith("q", "borges", { replace: true }),
      { timeout: 1000 },
    );
  });

  it("a parent re-render mid-typing does not reset the search debounce", async () => {
    vi.useFakeTimers();
    try {
      const setFacet = vi.fn();
      const clearAll = vi.fn();
      const baseProps = {
        values: { category: null, time: null, author: null, sort: "featured", q: "" },
        setFacet,
        clearAll,
        anyActive: false,
        locked: {},
      };
      const { rerender } = render(<CatalogFilterBar {...baseProps} />);

      // The debounce starts from the controlled-input change either way.
      fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: "borges" } });

      // 200ms into the 350ms debounce window, an unrelated parent re-render occurs
      // (new prop identities, same values).
      act(() => vi.advanceTimersByTime(200));
      rerender(<CatalogFilterBar {...baseProps} />);

      // If the re-render had reset the timer, nothing fires at the original 350ms mark
      // (200 + 160 = 360ms elapsed, but only 160ms since the re-render).
      act(() => vi.advanceTimersByTime(160));
      expect(setFacet).toHaveBeenCalledTimes(1);
      expect(setFacet).toHaveBeenCalledWith("q", "borges", { replace: true });
    } finally {
      vi.useRealTimers();
    }
  });
});
