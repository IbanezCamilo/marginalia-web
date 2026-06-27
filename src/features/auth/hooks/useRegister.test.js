import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRegister } from "./useRegister"

const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { register: vi.fn() },
}))

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: vi.fn(),
}))

const submitEvent = { preventDefault: vi.fn() }

describe("useRegister", () => {
  let refreshUser

  beforeEach(() => {
    refreshUser = vi.fn().mockResolvedValue({ id: 1 })
    useAuth.mockReturnValue({ actions: { refreshUser } })
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

  it("registers, refreshes the session, and navigates to the author-request page on success", async () => {
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
    expect(refreshUser).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith("/user/author-request")
    expect(result.current.loading).toBe(false)
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
  })

  it("toggles password visibility", () => {
    const { result } = renderHook(() => useRegister())

    act(() => result.current.toggleShowPassword())

    expect(result.current.showPassword).toBe(true)
  })
})
