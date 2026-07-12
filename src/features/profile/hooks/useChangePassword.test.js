import { act, renderHook } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { useChangePassword } from "./useChangePassword"

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: () => ({ actions: { logout: vi.fn() } }),
}))

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { changePassword: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const fillValidFields = (hook) => {
  act(() => {
    hook.current.setCurrentPassword("oldpass1")
    hook.current.setNewPassword("newpass1")
    hook.current.setConfirmNewPassword("newpass1")
  })
}

describe("useChangePassword", () => {
  let onClose

  beforeEach(() => {
    onClose = vi.fn()
  })

  it("resets all fields when the dialog opens", () => {
    const { result, rerender } = renderHook(({ isOpen }) => useChangePassword(isOpen, onClose), {
      initialProps: { isOpen: false },
    })

    act(() => {
      result.current.setCurrentPassword("leftover")
    })

    rerender({ isOpen: true })

    expect(result.current.currentPassword).toBe("")
    expect(result.current.newPassword).toBe("")
    expect(result.current.confirmNewPassword).toBe("")
    expect(result.current.fieldErrors).toEqual({})
  })

  it("toggles password visibility independently", () => {
    const { result } = renderHook(() => useChangePassword(true, onClose))

    act(() => result.current.toggleShowCurrentPassword())
    expect(result.current.showCurrentPassword).toBe(true)
    expect(result.current.showNewPassword).toBe(false)

    act(() => result.current.toggleShowNewPassword())
    expect(result.current.showNewPassword).toBe(true)
  })

  describe("validation", () => {
    it("requires the current password", async () => {
      const { result } = renderHook(() => useChangePassword(true, onClose))

      await act(async () => {
        await result.current.handleSave()
      })

      expect(result.current.fieldErrors.currentPassword).toBe("Ingresa tu contraseña actual.")
      expect(userService.changePassword).not.toHaveBeenCalled()
    })

    it("requires the new password to be at least 8 characters", async () => {
      const { result } = renderHook(() => useChangePassword(true, onClose))

      act(() => {
        result.current.setCurrentPassword("oldpass1")
        result.current.setNewPassword("short")
        result.current.setConfirmNewPassword("short")
      })

      await act(async () => {
        await result.current.handleSave()
      })

      expect(result.current.fieldErrors.newPassword).toBe(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      )
    })

    it("requires the password confirmation to match", async () => {
      const { result } = renderHook(() => useChangePassword(true, onClose))

      act(() => {
        result.current.setCurrentPassword("oldpass1")
        result.current.setNewPassword("newpass1")
        result.current.setConfirmNewPassword("different")
      })

      await act(async () => {
        await result.current.handleSave()
      })

      expect(result.current.fieldErrors.confirmNewPassword).toBe("Las contraseñas no coinciden.")
      expect(userService.changePassword).not.toHaveBeenCalled()
    })
  })

  it("submits the password change and closes on success", async () => {
    userService.changePassword.mockResolvedValueOnce({})
    const { result } = renderHook(() => useChangePassword(true, onClose))
    fillValidFields(result)

    await act(async () => {
      await result.current.handleSave()
    })

    expect(userService.changePassword).toHaveBeenCalledWith("oldpass1", "newpass1")
    expect(toast.success).toHaveBeenCalledWith("Contraseña actualizada. Inicia sesión nuevamente.")
    expect(onClose).toHaveBeenCalled()
    expect(result.current.saving).toBe(false)
  })

  it("shows a toast and does not close on failure", async () => {
    userService.changePassword.mockRejectedValueOnce(new Error("network down"))
    const { result } = renderHook(() => useChangePassword(true, onClose))
    fillValidFields(result)

    await act(async () => {
      await result.current.handleSave()
    })

    expect(toast.error).toHaveBeenCalledWith("No se pudo cambiar la contraseña.")
    expect(onClose).not.toHaveBeenCalled()
    expect(result.current.saving).toBe(false)
  })

  it("handleCancel closes the dialog", () => {
    const { result } = renderHook(() => useChangePassword(true, onClose))

    act(() => result.current.handleCancel())

    expect(onClose).toHaveBeenCalled()
  })
})
