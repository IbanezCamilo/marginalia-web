import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import ViewAllCategoriesTile from "./ViewAllCategoriesTile"

const renderTile = (props = {}) =>
  render(
    <MemoryRouter>
      <ViewAllCategoriesTile {...props} />
    </MemoryRouter>,
  )

describe("ViewAllCategoriesTile", () => {
  it("renders a link to the catalog", () => {
    renderTile({ remainingCount: 12 })

    const link = screen.getByRole("link", { name: /ver todas las categorias/i })
    expect(link).toHaveAttribute("href", "/catalog")
  })

  it("shows how many more categories there are", () => {
    renderTile({ remainingCount: 12 })

    expect(screen.getByText("+12 categorias")).toBeInTheDocument()
  })

  it("omits the count when there are no remaining categories", () => {
    renderTile({ remainingCount: 0 })

    expect(screen.queryByText(/\+\d+ categorias/)).not.toBeInTheDocument()
  })
})
