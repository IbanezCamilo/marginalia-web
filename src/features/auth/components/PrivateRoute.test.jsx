import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { useAuth } from "@/features/auth/hooks/useAuth"
import PrivateRoute from "./PrivateRoute"

vi.mock(import("@/features/auth/hooks/useAuth.js"), () => ({
  useAuth: vi.fn(),
}))

const renderWithAuth = (state) => {
  useAuth.mockReturnValue({ state })
  return render(
    <MemoryRouter initialEntries={["/user/dashboard"]}>
      <Routes>
        <Route path="/auth/login" element={<div>Login page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/user/dashboard" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe("PrivateRoute", () => {
  it("renders nothing while auth is loading", () => {
    const { container } = renderWithAuth({ user: null, loading: true })

    expect(container).toBeEmptyDOMElement()
  })

  it("redirects to login when there is no user", () => {
    renderWithAuth({ user: null, loading: false })

    expect(screen.getByText("Login page")).toBeInTheDocument()
  })

  it("renders the protected route when authenticated", () => {
    renderWithAuth({ user: { id: 1, role: "AUTHOR" }, loading: false })

    expect(screen.getByText("Protected content")).toBeInTheDocument()
  })
})
