import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { PENDING_VERIFICATION_EMAIL_KEY } from "./useVerificationStatusPoll"
import { useRegister } from "./useRegister"

const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { register: vi.fn() },
}))

const submitEvent = { preventDefault: vi.fn() }

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it("requires name, email, and password independently", async () => {
    const { result } = renderHook(() => useRegister())

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(result.current.fieldErrors).toEqual({
      name: "Ingresa tu nombre.",
      email: "Ingresa tu correo electrónico.",
      password: "Ingresa una contraseña.",
    })
    expect(userService.register).not.toHaveBeenCalled()
  })

  it("registers and navigates to the check-email page without opening a session", async () => {
    userService.register.mockResolvedValueOnce({})
    const { result } = renderHook(() => useRegister())

    act(() => {
      result.current.setName("Alice")
      result.current.setEmail("a@b.com")
      result.current.setPassword("secret")
    })

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(userService.register).toHaveBeenCalledWith({
      name: "Alice",
      email: "a@b.com",
      password: "secret",
    })
    expect(navigateMock).toHaveBeenCalledWith("/auth/check-email", { state: { email: "a@b.com" } })
    expect(result.current.loading).toBe(false)
    // Persisted so the check-email page can keep polling after a refresh.
    expect(sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)).toBe("a@b.com")
  })

  it("normalizes the email (trim + lowercase) and trims the name before submitting", async () => {
    userService.register.mockResolvedValueOnce({})
    const { result } = renderHook(() => useRegister())

    act(() => {
      result.current.setName("  Alice ")
      result.current.setEmail("  CamiloIp@Outlook.COM ")
      result.current.setPassword("secret")
    })

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(userService.register).toHaveBeenCalledWith({
      name: "Alice",
      email: "camiloip@outlook.com",
      password: "secret",
    })
    // The check-email flow must poll the same normalized address the backend stored.
    expect(navigateMock).toHaveBeenCalledWith("/auth/check-email", {
      state: { email: "camiloip@outlook.com" },
    })
    expect(sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)).toBe("camiloip@outlook.com")
  })

  it("sets an error and does not navigate on failure", async () => {
    userService.register.mockRejectedValueOnce(new Error("email taken"))
    const { result } = renderHook(() => useRegister())

    act(() => {
      result.current.setName("Alice")
      result.current.setEmail("a@b.com")
      result.current.setPassword("secret")
    })

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(result.current.error).toBe("Error de conexión con el servidor.")
    expect(navigateMock).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)).toBeNull()
  })

  it("toggles password visibility", () => {
    const { result } = renderHook(() => useRegister())

    act(() => result.current.toggleShowPassword())

    expect(result.current.showPassword).toBe(true)
  })
})
