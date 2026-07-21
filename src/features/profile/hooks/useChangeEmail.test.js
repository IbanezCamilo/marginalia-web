import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { userService } from "@/features/profile/services/userService"
import { ApiError } from "@/lib/apiError"
import { useChangeEmail } from "./useChangeEmail"

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { changeEmail: vi.fn() },
}))

describe("useChangeEmail", () => {
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("rejects an invalid email without calling the service", async () => {
    const { result } = renderHook(() => useChangeEmail(true, onClose))

    act(() => {
      result.current.setNewEmail("not-an-email")
      result.current.setCurrentPassword("secret123")
    })
    await act(async () => {
      await result.current.handleSave()
    })

    expect(result.current.fieldErrors.newEmail).toBeTruthy()
    expect(userService.changeEmail).not.toHaveBeenCalled()
  })

  it("requires the current password", async () => {
    const { result } = renderHook(() => useChangeEmail(true, onClose))

    act(() => {
      result.current.setNewEmail("new@test.com")
    })
    await act(async () => {
      await result.current.handleSave()
    })

    expect(result.current.fieldErrors.currentPassword).toBeTruthy()
    expect(userService.changeEmail).not.toHaveBeenCalled()
  })

  it("submits a valid request, shows a confirmation toast, and closes without logging out", async () => {
    userService.changeEmail.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useChangeEmail(true, onClose))

    act(() => {
      result.current.setNewEmail("  New@Test.com ")
      result.current.setCurrentPassword("secret123")
    })
    await act(async () => {
      await result.current.handleSave()
    })

    expect(userService.changeEmail).toHaveBeenCalledWith({
      newEmail: "New@Test.com", // trimmed; server lowercases
      currentPassword: "secret123",
    })
    expect(toast.success).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it("surfaces a backend error via toast and stays open", async () => {
    userService.changeEmail.mockRejectedValueOnce(
      new ApiError({ message: "conflict", status: 409, body: { detail: "El correo ya está en uso" } }))
    const { result } = renderHook(() => useChangeEmail(true, onClose))

    act(() => {
      result.current.setNewEmail("taken@test.com")
      result.current.setCurrentPassword("secret123")
    })
    await act(async () => {
      await result.current.handleSave()
    })

    expect(toast.error).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it("resets fields when the dialog reopens", async () => {
    const { result, rerender } = renderHook(({ open }) => useChangeEmail(open, onClose), {
      initialProps: { open: true },
    })

    act(() => {
      result.current.setNewEmail("typed@test.com")
    })
    await waitFor(() => expect(result.current.newEmail).toBe("typed@test.com"))

    rerender({ open: false })
    rerender({ open: true })

    expect(result.current.newEmail).toBe("")
  })
})
