import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { emailVerificationService } from "@/features/auth/services/emailVerificationService"
import { ApiError } from "@/lib/apiError"
import { useVerifyEmail } from "./useVerifyEmail"

let searchParams = new URLSearchParams()
const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useSearchParams: () => [searchParams],
    useNavigate: () => navigateMock,
  }
})

vi.mock(import("@/features/auth/services/emailVerificationService"), () => ({
  emailVerificationService: { verify: vi.fn() },
}))

describe("useVerifyEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchParams = new URLSearchParams("token=raw-token")
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("verifies the token from the URL and reports success", async () => {
    emailVerificationService.verify.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useVerifyEmail())

    expect(result.current.status).toBe("verifying")
    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.verify).toHaveBeenCalledWith("raw-token")
  })

  it("reports expired on HTTP 410", async () => {
    emailVerificationService.verify.mockRejectedValueOnce(
      new ApiError({ message: "gone", status: 410, body: {} }))

    const { result } = renderHook(() => useVerifyEmail())

    await waitFor(() => expect(result.current.status).toBe("expired"))
  })

  it("reports invalid on HTTP 400", async () => {
    emailVerificationService.verify.mockRejectedValueOnce(
      new ApiError({ message: "bad", status: 400, body: {} }))

    const { result } = renderHook(() => useVerifyEmail())

    await waitFor(() => expect(result.current.status).toBe("invalid"))
  })

  it("reports a generic error on network failures", async () => {
    emailVerificationService.verify.mockRejectedValueOnce(new Error("offline"))

    const { result } = renderHook(() => useVerifyEmail())

    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("reports invalid without calling the API when the token is missing", () => {
    searchParams = new URLSearchParams()

    const { result } = renderHook(() => useVerifyEmail())

    expect(result.current.status).toBe("invalid")
    expect(emailVerificationService.verify).not.toHaveBeenCalled()
  })

  it("redirects to the login page shortly after success", async () => {
    vi.useFakeTimers()
    emailVerificationService.verify.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useVerifyEmail())

    // Flush the verify promise without waitFor (it polls real timers).
    await act(async () => {})
    expect(result.current.status).toBe("success")
    expect(navigateMock).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(navigateMock).toHaveBeenCalledWith("/auth/login")
  })

  it("does not redirect on expired or invalid tokens", async () => {
    vi.useFakeTimers()
    emailVerificationService.verify.mockRejectedValueOnce(
      new ApiError({ message: "gone", status: 410, body: {} }))

    const { result } = renderHook(() => useVerifyEmail())

    await act(async () => {})
    expect(result.current.status).toBe("expired")

    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it("cancels the redirect if the page unmounts first", async () => {
    vi.useFakeTimers()
    emailVerificationService.verify.mockResolvedValueOnce(null)

    const { result, unmount } = renderHook(() => useVerifyEmail())

    await act(async () => {})
    expect(result.current.status).toBe("success")

    unmount()
    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it("only sends the single-use token once even if the effect re-runs", async () => {
    emailVerificationService.verify.mockResolvedValue(null)

    const { result, rerender } = renderHook(() => useVerifyEmail())
    rerender()

    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.verify).toHaveBeenCalledTimes(1)
  })
})
