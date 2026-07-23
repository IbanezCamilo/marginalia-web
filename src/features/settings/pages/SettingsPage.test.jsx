import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SettingsPage from "./SettingsPage"

const ALL_ON = {
  "notifications.post-moderation": "true",
  "privacy.show-bio": "true",
  "privacy.show-photo": "true",
}

const { authState, prefsState } = vi.hoisted(() => ({
  authState: { user: { role: "AUTHOR" } },
  prefsState: {
    preferences: null,
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

/** Switches in DOM order: moderation emails, show bio, show photo. */
const switches = () => screen.getAllByRole("switch")
const moderationSwitch = () => switches()[0]
const bioSwitch = () => switches()[1]
const photoSwitch = () => switches()[2]

describe("SettingsPage", () => {
  beforeEach(() => {
    authState.user = { role: "AUTHOR" }
    prefsState.preferences = { ...ALL_ON }
    prefsState.loading = false
    prefsState.error = null
    prefsState.toggle.mockClear()
  })

  it("shows the notifications section with the toggle for an AUTHOR", () => {
    render(<SettingsPage />)

    expect(screen.getByText("Notificaciones")).toBeInTheDocument()
    expect(moderationSwitch()).toBeChecked()
  })

  it("shows the notifications section for roles above AUTHOR", () => {
    authState.user = { role: "ADMIN" }

    render(<SettingsPage />)

    expect(screen.getByText("Notificaciones")).toBeInTheDocument()
  })

  it("shows the empty state instead of the sections for a READER", () => {
    authState.user = { role: "READER" }

    render(<SettingsPage />)

    expect(screen.queryByText("Notificaciones")).not.toBeInTheDocument()
    expect(screen.queryByText("Privacidad")).not.toBeInTheDocument()
    expect(screen.queryByRole("switch")).not.toBeInTheDocument()
    expect(screen.getByText("Aún no hay ajustes disponibles")).toBeInTheDocument()
  })

  it("renders the switch unchecked when the preference is off", () => {
    prefsState.preferences = { ...ALL_ON, "notifications.post-moderation": "false" }

    render(<SettingsPage />)

    expect(moderationSwitch()).not.toBeChecked()
  })

  it("shows the empty state for a READER even when loading failed", () => {
    authState.user = { role: "READER" }
    prefsState.error = "No se pudieron cargar tus preferencias."

    render(<SettingsPage />)

    expect(screen.getByText("Aún no hay ajustes disponibles")).toBeInTheDocument()
    expect(screen.queryByText("No pudimos cargar tus preferencias")).not.toBeInTheDocument()
  })

  describe("privacy section", () => {
    it("shows both privacy switches reflecting the stored preferences", () => {
      prefsState.preferences = { ...ALL_ON, "privacy.show-photo": "false" }

      render(<SettingsPage />)

      expect(screen.getByText("Privacidad")).toBeInTheDocument()
      expect(screen.getByText("Mostrar mi biografía")).toBeInTheDocument()
      expect(screen.getByText("Mostrar mi foto de perfil")).toBeInTheDocument()
      expect(bioSwitch()).toBeChecked()
      expect(photoSwitch()).not.toBeChecked()
    })

    it("toggles the bio preference by its own key", async () => {
      render(<SettingsPage />)

      await userEvent.click(bioSwitch())

      expect(prefsState.toggle).toHaveBeenCalledWith("privacy.show-bio")
    })

    it("toggles the photo preference by its own key", async () => {
      render(<SettingsPage />)

      await userEvent.click(photoSwitch())

      expect(prefsState.toggle).toHaveBeenCalledWith("privacy.show-photo")
    })

    // The caveat must never become conditional: an author needs it before flipping the
    // switch, and without it the toggle reads as "revoke my photo", which it is not.
    it.each([
      ["on", "true"],
      ["off", "false"],
    ])("keeps the name and direct-link notes visible with the photo switch %s", (_, value) => {
      prefsState.preferences = { ...ALL_ON, "privacy.show-photo": value }

      render(<SettingsPage />)

      expect(screen.getByText(/Tu nombre siempre es público/)).toBeInTheDocument()
      expect(
        screen.getByText(/ya tiene el enlace directo a tu foto anterior/),
      ).toBeInTheDocument()
    })
  })
})
