import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "sonner"
import { emailVerificationService } from "@/features/auth/services/emailVerificationService"
import { PENDING_VERIFICATION_EMAIL_KEY, useVerificationStatusPoll } from "./useVerificationStatusPoll"

const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock(import("@/features/auth/services/emailVerificationService"), () => ({
  emailVerificationService: { getVerificationStatus: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function setVisibility(state) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  })
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"))
  })
}

async function advance(ms) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe("useVerificationStatusPoll", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    sessionStorage.clear()
    emailVerificationService.getVerificationStatus.mockResolvedValue({ verified: false })
  })

  afterEach(() => {
    setVisibility("visible")
    vi.useRealTimers()
  })

  it("checks immediately on mount and then every 12 seconds", async () => {
    renderHook(() => useVerificationStatusPoll("a@b.com"))

    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledWith("a@b.com")
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    await advance(12_000)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(2)

    await advance(12_000)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(3)
  })

  it("does nothing without an email", async () => {
    renderHook(() => useVerificationStatusPoll(""))

    await advance(24_000)
    expect(emailVerificationService.getVerificationStatus).not.toHaveBeenCalled()
  })

  it("redirects to login, toasts, and clears the stored email once verified", async () => {
    sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, "a@b.com")
    emailVerificationService.getVerificationStatus
      .mockResolvedValueOnce({ verified: false })
      .mockResolvedValueOnce({ verified: true })

    renderHook(() => useVerificationStatusPoll("a@b.com"))
    await advance(12_000)

    expect(toast.success).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith("/auth/login")
    expect(sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)).toBeNull()
  })

  it("stops polling after the account is verified", async () => {
    emailVerificationService.getVerificationStatus.mockResolvedValue({ verified: true })

    renderHook(() => useVerificationStatusPoll("a@b.com"))
    await advance(0)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    await advance(36_000)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledTimes(1)
  })

  it("keeps polling silently when a check fails", async () => {
    emailVerificationService.getVerificationStatus
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ verified: false })

    renderHook(() => useVerificationStatusPoll("a@b.com"))
    await advance(12_000)

    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(2)
    expect(toast.error).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it("stops polling on unmount", async () => {
    const { unmount } = renderHook(() => useVerificationStatusPoll("a@b.com"))
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    unmount()
    await advance(36_000)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)
  })

  it("pauses while the tab is hidden and checks immediately when it becomes visible", async () => {
    renderHook(() => useVerificationStatusPoll("a@b.com"))
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    setVisibility("hidden")
    await advance(36_000)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    setVisibility("visible")
    await advance(0)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(2)
  })

  it("rapid visibility toggles within the 5s gap trigger only one extra check", async () => {
    renderHook(() => useVerificationStatusPoll("a@b.com"))
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(1)

    await advance(6_000)
    setVisibility("hidden")
    setVisibility("visible")
    await advance(0)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(2)

    await advance(1_000)
    setVisibility("hidden")
    setVisibility("visible")
    await advance(0)
    setVisibility("hidden")
    setVisibility("visible")
    await advance(0)
    expect(emailVerificationService.getVerificationStatus).toHaveBeenCalledTimes(2)
  })
})
