import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useLogin } from "./useLogin"

const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { login: vi.fn() },
}))

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: vi.fn(),
}))

const submitEvent = { preventDefault: vi.fn() }

describe("useLogin", () => {
  let refreshUser

  beforeEach(() => {
    refreshUser = vi.fn().mockResolvedValue({ id: 1 })
    useAuth.mockReturnValue({ actions: { refreshUser } })
  })

  it("requires both email and password", async () => {
    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(result.current.fieldErrors).toEqual({
      email: "Ingresa tu correo electrónico.",
      password: "Ingresa tu contraseña.",
    })
    expect(userService.login).not.toHaveBeenCalled()
  })

  it("logs in, refreshes the session, and navigates to the dashboard on success", async () => {
    userService.login.mockResolvedValueOnce({})
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail("a@b.com")
      result.current.setPassword("secret")
    })

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(userService.login).toHaveBeenCalledWith({ email: "a@b.com", password: "secret" })
    expect(refreshUser).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith("/user/dashboard")
    expect(result.current.loading).toBe(false)
  })

  it("sets an error and does not navigate on failure", async () => {
    userService.login.mockRejectedValueOnce(new Error("bad credentials"))
    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.setEmail("a@b.com")
      result.current.setPassword("secret")
    })

    await act(async () => {
      await result.current.handleSubmit(submitEvent)
    })

    expect(result.current.error).toBe("Error de conexión con el servidor.")
    expect(navigateMock).not.toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
  })

  it("toggles password visibility", () => {
    const { result } = renderHook(() => useLogin())

    act(() => result.current.toggleShowPassword())

    expect(result.current.showPassword).toBe(true)
  })
})
