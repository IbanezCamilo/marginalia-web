import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { useAuth } from "@/features/auth/hooks/useAuth"
import RoleRoute from "./RoleRoute"

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: vi.fn(),
}))

const renderWithAuth = (state, minRole) => {
  useAuth.mockReturnValue({ state })
  return render(
    <MemoryRouter initialEntries={["/user/admin-area"]}>
      <Routes>
        <Route path="/user/dashboard" element={<div>Dashboard fallback</div>} />
        <Route element={<RoleRoute minRole={minRole} />}>
          <Route path="/user/admin-area" element={<div>Admin area</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("RoleRoute", () => {
  it("renders nothing while auth is loading", () => {
    const { container } = renderWithAuth({ user: { role: "ADMIN" }, loading: true }, "ADMIN")

    expect(container).toBeEmptyDOMElement()
  })

  it("renders the protected route when the user's role meets the minimum", () => {
    renderWithAuth({ user: { role: "ADMIN" }, loading: false }, "ADMIN")

    expect(screen.getByText("Admin area")).toBeInTheDocument()
  })

  it("renders the protected route when the user's role exceeds the minimum", () => {
    renderWithAuth({ user: { role: "OWNER" }, loading: false }, "ADMIN")

    expect(screen.getByText("Admin area")).toBeInTheDocument()
  })

  it("redirects to the dashboard when the user's role is below the minimum", () => {
    renderWithAuth({ user: { role: "AUTHOR" }, loading: false }, "ADMIN")

    expect(screen.getByText("Dashboard fallback")).toBeInTheDocument()
  })

  it("redirects when there is no authenticated user", () => {
    renderWithAuth({ user: null, loading: false }, "AUTHOR")

    expect(screen.getByText("Dashboard fallback")).toBeInTheDocument()
  })

  it("treats an unrecognized minRole as level 0, granting access to any authenticated user", () => {
    renderWithAuth({ user: { role: "READER" }, loading: false }, "SUPERUSER")

    expect(screen.getByText("Admin area")).toBeInTheDocument()
  })
})
