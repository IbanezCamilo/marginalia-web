import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { publicPostService } from "@/features/posts/services/publicPostService";
import PostCatalog from "./PostCatalog";

vi.mock(import("@/features/posts/services/publicPostService"), () => ({
  publicPostService: { getCatalog: vi.fn() },
}));

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

const PAGE = (posts) => ({
  content: posts,
  page: { totalElements: posts.length, totalPages: 1 },
});

const POST = { slug: "el-otono", title: "El otoño", categoryName: "Ficción", authorName: "Alice Munro" };

const renderCatalog = (initialSearch = "", props = {}) =>
  render(
    <MemoryRouter initialEntries={[`/catalog${initialSearch}`]}>
      <PostCatalog {...props} />
    </MemoryRouter>,
  );

describe("PostCatalog", () => {
  beforeEach(() => {
    publicPostService.getCatalog.mockReset();
    publicPostService.getCatalog.mockResolvedValue(PAGE([POST]));
  });

  it("passes stacked URL facets to the service as combined params", async () => {
    renderCatalog("?category=ficcion&time=short&author=7&q=borges&sort=recent");

    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith({
        category: "ficcion",
        time: "short",
        authorId: "7",
        q: "borges",
        sort: "recent",
        page: 0,
        size: 12,
      }),
    );
    expect(await screen.findByText("El otoño")).toBeInTheDocument();
  });

  it("locks the category facet when lockedCategorySlug is given", async () => {
    renderCatalog("", { lockedCategorySlug: "poesia" });

    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith(
        expect.objectContaining({ category: "poesia" }),
      ),
    );
    // the locked facet is not rendered as a control
    expect(screen.queryByRole("button", { name: /categoría/i })).not.toBeInTheDocument();
  });

  it("empty state with active filters offers per-facet removal and clear-all", async () => {
    publicPostService.getCatalog.mockResolvedValue(PAGE([]));
    const user = userEvent.setup();
    renderCatalog("?time=short&q=borges");

    expect(
      await screen.findByText(/no hay publicaciones con estos filtros/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quitar tiempo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quitar buscar/i })).toBeInTheDocument();

    // removing one facet refetches without it
    await user.click(screen.getByRole("button", { name: /quitar tiempo/i }));
    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith(
        expect.not.objectContaining({ time: "short" }),
      ),
    );
  });

  it("keeps the filter bar mounted while results reload", async () => {
    renderCatalog();
    await screen.findByText("El otoño");

    // trigger a reload by picking a facet; the search input must not unmount
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /tiempo/i }));
    await user.click(await screen.findByRole("menuitem", { name: "Un café" }));

    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument();
  });
});
