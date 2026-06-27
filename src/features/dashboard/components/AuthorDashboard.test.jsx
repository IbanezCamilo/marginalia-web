import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { useAuthorDashboard } from "../hooks/useAuthorDashboard"
import { AuthorDashboard } from "./AuthorDashboard"

vi.mock(import("../hooks/useAuthorDashboard"), () => ({
  useAuthorDashboard: vi.fn(),
}))

const BASE_STATE = {
  user: { name: "Alice" },
  recentPosts: [],
  stats: { total: 0, published: 0, drafts: 0, rejected: 0 },
  mostRecentDraft: null,
  loading: false,
  error: null,
  reload: vi.fn(),
}

const renderDashboard = (overrides = {}) => {
  useAuthorDashboard.mockReturnValue({ ...BASE_STATE, ...overrides })
  return render(<AuthorDashboard />, { wrapper: MemoryRouter })
}

describe("AuthorDashboard", () => {
  it("shows skeletons while loading", () => {
    renderDashboard({ loading: true })

    expect(screen.queryByText(/Bienvenido/)).not.toBeInTheDocument()
  })

  it("shows an error state with a retry action", async () => {
    const reload = vi.fn()
    renderDashboard({ loading: false, error: "No se pudo cargar la información.", reload })

    expect(screen.getByText("No pudimos abrir el panel")).toBeInTheDocument()
    expect(screen.getByText("No se pudo cargar la información.")).toBeInTheDocument()

    const { default: userEvent } = await import("@testing-library/user-event")
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }))
    expect(reload).toHaveBeenCalled()
  })

  it("renders the user's name and post stats", () => {
    renderDashboard({
      user: { name: "Alice" },
      stats: { total: 12, published: 8, drafts: 3, rejected: 1 },
    })

    expect(screen.getByText("Bienvenido, Alice.")).toBeInTheDocument()
    expect(screen.getByText("12")).toBeInTheDocument()
    expect(screen.getByText("8")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("offers to continue the most recent draft when one exists", () => {
    renderDashboard({ mostRecentDraft: { id: 42, title: "Draft post" } })

    const link = screen.getByRole("link", { name: /Continuar borrador/ })
    expect(link).toHaveAttribute("href", "/user/edit-post/42")
    expect(screen.queryByRole("link", { name: /Ajustar perfil público/ })).not.toBeInTheDocument()
  })

  it("offers to adjust the public profile when there is no draft", () => {
    renderDashboard({ mostRecentDraft: null })

    expect(screen.getByRole("link", { name: /Ajustar perfil público/ })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Continuar borrador/ })).not.toBeInTheDocument()
  })

  it("shows recent posts when present", () => {
    renderDashboard({
      recentPosts: [{ id: 1, title: "My recent post", status: "PUBLISHED", categoryName: "Poetry" }],
    })

    expect(screen.getByText("My recent post")).toBeInTheDocument()
  })

  it("shows an empty-state prompt when there are no posts yet", () => {
    renderDashboard({ recentPosts: [] })

    expect(screen.getByText("Tu primera publicación espera")).toBeInTheDocument()
  })
})
