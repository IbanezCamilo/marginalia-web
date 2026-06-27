import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useAuth } from "@/features/auth/hooks/useAuth"
import Dashboard from "./Dashboard"

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: vi.fn(),
}))

vi.mock(import("../components/ReaderDashboard"), () => ({
  ReaderDashboard: ({ user }) => <div data-testid="reader-dashboard">{user?.name}</div>,
}))
vi.mock(import("../components/AuthorDashboard"), () => ({
  AuthorDashboard: () => <div data-testid="author-dashboard" />,
}))
vi.mock(import("../components/ModeratorDashboard"), () => ({
  ModeratorDashboard: () => <div data-testid="moderator-dashboard" />,
}))
vi.mock(import("../components/AdminDashboard"), () => ({
  AdminDashboard: () => <div data-testid="admin-dashboard" />,
}))
vi.mock(import("../components/OwnerDashboard"), () => ({
  OwnerDashboard: () => <div data-testid="owner-dashboard" />,
}))

const renderWithRole = (role, name = "Test User") => {
  useAuth.mockReturnValue({ state: { user: role ? { role, name } : null } })
  return render(<Dashboard />)
}

describe("Dashboard", () => {
  it.for([
    ["AUTHOR", "author-dashboard"],
    ["MODERATOR", "moderator-dashboard"],
    ["ADMIN", "admin-dashboard"],
    ["OWNER", "owner-dashboard"],
  ])("renders the %s dashboard for role %s", ([role, testId]) => {
    renderWithRole(role)

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })

  it("renders the reader dashboard with the user for the READER role", () => {
    renderWithRole("READER", "Alice")

    expect(screen.getByTestId("reader-dashboard")).toHaveTextContent("Alice")
  })

  it("renders nothing for an unrecognized role", () => {
    const { container } = renderWithRole("UNKNOWN_ROLE")

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when there is no authenticated user", () => {
    const { container } = renderWithRole(null)

    expect(container).toBeEmptyDOMElement()
  })
})
