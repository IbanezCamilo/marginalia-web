import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { useAuth } from "../hooks/useAuth"
import { AuthProvider } from "./AuthContext"

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { getProfile: vi.fn(), logout: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { error: vi.fn() },
}))

const renderAuth = () => renderHook(() => useAuth(), { wrapper: AuthProvider })

describe("AuthProvider", () => {
  beforeEach(() => {
    userService.getProfile.mockResolvedValue({ id: 1, name: "Alice", role: "AUTHOR" })
  })

  it("starts in a loading state and resolves once the profile loads", async () => {
    const { result } = renderAuth()

    expect(result.current.state.loading).toBe(true)

    await waitFor(() => expect(result.current.state.loading).toBe(false))

    expect(result.current.state.user).toEqual({ id: 1, name: "Alice", role: "AUTHOR" })
    expect(result.current.meta).toMatchObject({
      isAuthor: true,
      isAdmin: false,
      isModerator: false,
      isOwner: false,
      isAuthenticated: true,
    })
  })

  it("clears the user when the initial profile load fails", async () => {
    userService.getProfile.mockReset()
    userService.getProfile.mockRejectedValueOnce(new Error("401"))

    const { result } = renderAuth()

    await waitFor(() => expect(result.current.state.loading).toBe(false))

    expect(result.current.state.user).toBeNull()
    expect(result.current.meta.isAuthenticated).toBe(false)
  })

  it("clears the user and shows a toast on session-expired when a user was logged in", async () => {
    const { result } = renderAuth()
    await waitFor(() => expect(result.current.state.user).not.toBeNull())

    window.dispatchEvent(new CustomEvent("auth:session-expired"))
    await waitFor(() => expect(result.current.state.user).toBeNull())

    expect(toast.error).toHaveBeenCalledWith("Tu sesión ha expirado. Inicia sesión nuevamente.")
  })

  it("clears silently on session-expired when there was no logged-in user", async () => {
    userService.getProfile.mockReset()
    userService.getProfile.mockRejectedValueOnce(new Error("401"))

    const { result } = renderAuth()
    await waitFor(() => expect(result.current.state.loading).toBe(false))
    expect(result.current.state.user).toBeNull()

    window.dispatchEvent(new CustomEvent("auth:session-expired"))

    expect(toast.error).not.toHaveBeenCalled()
    expect(result.current.state.user).toBeNull()
  })

  it("refreshUser updates the user on success", async () => {
    const { result } = renderAuth()
    await waitFor(() => expect(result.current.state.loading).toBe(false))

    userService.getProfile.mockResolvedValueOnce({ id: 1, name: "Alice Updated", role: "ADMIN" })

    let profile
    await act(async () => {
      profile = await result.current.actions.refreshUser()
    })

    expect(profile).toEqual({ id: 1, name: "Alice Updated", role: "ADMIN" })
    expect(result.current.state.user.name).toBe("Alice Updated")
    expect(result.current.meta.isAdmin).toBe(true)
  })

  it("refreshUser clears the user on failure", async () => {
    const { result } = renderAuth()
    await waitFor(() => expect(result.current.state.loading).toBe(false))

    userService.getProfile.mockRejectedValueOnce(new Error("boom"))

    await act(async () => {
      await result.current.actions.refreshUser()
    })

    expect(result.current.state.user).toBeNull()
  })

  it("logout calls the service and clears the user", async () => {
    userService.logout.mockResolvedValueOnce(undefined)
    const { result } = renderAuth()
    await waitFor(() => expect(result.current.state.loading).toBe(false))

    await act(async () => {
      await result.current.actions.logout()
    })

    expect(userService.logout).toHaveBeenCalled()
    expect(result.current.state.user).toBeNull()
  })
})
