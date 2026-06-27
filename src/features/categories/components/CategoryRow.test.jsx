import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import CategoryRow from "./CategoryRow"

const renderRow = (category, onDelete = vi.fn()) =>
  render(
    <table>
      <tbody>
        <CategoryRow category={category} onDelete={onDelete} />
      </tbody>
    </table>,
  )

describe("CategoryRow", () => {
  it("renders the category name and slug", () => {
    renderRow({ id: 1, name: "Poetry", slug: "poetry", createdAt: "2024-03-15T00:00:00Z" })

    expect(screen.getByText("Poetry")).toBeInTheDocument()
    expect(screen.getByText("poetry")).toBeInTheDocument()
  })

  it("formats the creation date", () => {
    renderRow({ id: 1, name: "Poetry", slug: "poetry", createdAt: "2024-03-15T00:00:00Z" })

    expect(screen.getByText(/mar/i)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it("shows a placeholder when there is no creation date", () => {
    renderRow({ id: 1, name: "Poetry", slug: "poetry", createdAt: null })

    expect(screen.getByText("-")).toBeInTheDocument()
  })

  it("calls onDelete when the delete action is selected from the row menu", async () => {
    const onDelete = vi.fn()
    renderRow({ id: 1, name: "Poetry", slug: "poetry", createdAt: null }, onDelete)

    await userEvent.click(screen.getByRole("button"))
    await userEvent.click(await screen.findByText("Eliminar"))

    expect(onDelete).toHaveBeenCalled()
  })
})
