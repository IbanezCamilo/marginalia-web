import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { emailVerificationService } from "@/features/auth/services/emailVerificationService"
import { useResendVerification } from "./useResendVerification"

vi.mock(import("@/features/auth/services/emailVerificationService"), () => ({
  emailVerificationService: { resend: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe("useResendVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("resends and starts the 60-second cooldown", async () => {
    emailVerificationService.resend.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useResendVerification())

    await act(async () => {
      await result.current.resend("a@b.com")
    })

    expect(emailVerificationService.resend).toHaveBeenCalledWith("a@b.com")
    expect(toast.success).toHaveBeenCalled()
    expect(result.current.cooldown).toBe(60)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current.cooldown).toBe(0)
  })

  it("ignores calls while the cooldown is active", async () => {
    emailVerificationService.resend.mockResolvedValue(null)
    const { result } = renderHook(() => useResendVerification())

    await act(async () => {
      await result.current.resend("a@b.com")
    })
    await act(async () => {
      await result.current.resend("a@b.com")
    })

    expect(emailVerificationService.resend).toHaveBeenCalledTimes(1)
  })

  it("ignores blank emails", async () => {
    const { result } = renderHook(() => useResendVerification())

    await act(async () => {
      await result.current.resend("   ")
    })

    expect(emailVerificationService.resend).not.toHaveBeenCalled()
  })

  it("shows an error toast and skips the cooldown on failure", async () => {
    emailVerificationService.resend.mockRejectedValueOnce(new Error("offline"))
    const { result } = renderHook(() => useResendVerification())

    await act(async () => {
      await result.current.resend("a@b.com")
    })

    expect(toast.error).toHaveBeenCalled()
    expect(result.current.cooldown).toBe(0)
  })
})
