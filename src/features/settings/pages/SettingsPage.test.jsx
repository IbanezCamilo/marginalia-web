import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SettingsPage from "./SettingsPage"

const { authState, prefsState } = vi.hoisted(() => ({
  authState: { user: { role: "AUTHOR" } },
  prefsState: {
    preferences: { "notifications.post-moderation": "true" },
    loading: false,
    saving: false,
    error: null,
    reload: vi.fn(),
    toggle: vi.fn(),
  },
}))

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: () => ({ state: authState }),
}))

vi.mock(import("@/features/settings/hooks/usePreferences"), () => ({
  usePreferences: () => prefsState,
}))

describe("SettingsPage", () => {
  beforeEach(() => {
    authState.user = { role: "AUTHOR" }
    prefsState.loading = false
    prefsState.error = null
  })

  it("shows the notifications section with the toggle for an AUTHOR", () => {
    render(<SettingsPage />)

    expect(screen.getByText("Notificaciones")).toBeInTheDocument()
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("shows the notifications section for roles above AUTHOR", () => {
    authState.user = { role: "ADMIN" }

    render(<SettingsPage />)

    expect(screen.getByText("Notificaciones")).toBeInTheDocument()
  })

  it("shows the empty state instead of the section for a READER", () => {
    authState.user = { role: "READER" }

    render(<SettingsPage />)

    expect(screen.queryByText("Notificaciones")).not.toBeInTheDocument()
    expect(screen.queryByRole("switch")).not.toBeInTheDocument()
    expect(screen.getByText("Aún no hay ajustes disponibles")).toBeInTheDocument()
  })

  it("renders the switch unchecked when the preference is off", () => {
    prefsState.preferences = { "notifications.post-moderation": "false" }

    render(<SettingsPage />)

    expect(screen.getByRole("switch")).not.toBeChecked()
  })

  it("shows the empty state for a READER even when loading failed", () => {
    authState.user = { role: "READER" }
    prefsState.error = "No se pudieron cargar tus preferencias."

    render(<SettingsPage />)

    expect(screen.getByText("Aún no hay ajustes disponibles")).toBeInTheDocument()
    expect(screen.queryByText("No pudimos cargar tus preferencias")).not.toBeInTheDocument()
  })
})
