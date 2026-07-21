import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { emailVerificationService } from "@/features/auth/services/emailVerificationService"
import { ApiError } from "@/lib/apiError"
import { useConfirmEmailChange } from "./useConfirmEmailChange"

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
  emailVerificationService: { confirmEmailChange: vi.fn() },
}))

describe("useConfirmEmailChange", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchParams = new URLSearchParams("token=confirm-raw")
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("confirms the token from the URL and reports success", async () => {
    emailVerificationService.confirmEmailChange.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useConfirmEmailChange())

    expect(result.current.status).toBe("confirming")
    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.confirmEmailChange).toHaveBeenCalledWith("confirm-raw")
  })

  it("reports expired on HTTP 410", async () => {
    emailVerificationService.confirmEmailChange.mockRejectedValueOnce(
      new ApiError({ message: "gone", status: 410, body: {} }))

    const { result } = renderHook(() => useConfirmEmailChange())

    await waitFor(() => expect(result.current.status).toBe("expired"))
  })

  it("reports conflict on HTTP 409 (address taken since the request)", async () => {
    emailVerificationService.confirmEmailChange.mockRejectedValueOnce(
      new ApiError({ message: "conflict", status: 409, body: {} }))

    const { result } = renderHook(() => useConfirmEmailChange())

    await waitFor(() => expect(result.current.status).toBe("conflict"))
  })

  it("reports invalid on HTTP 400", async () => {
    emailVerificationService.confirmEmailChange.mockRejectedValueOnce(
      new ApiError({ message: "bad", status: 400, body: {} }))

    const { result } = renderHook(() => useConfirmEmailChange())

    await waitFor(() => expect(result.current.status).toBe("invalid"))
  })

  it("reports a generic error on network failures", async () => {
    emailVerificationService.confirmEmailChange.mockRejectedValueOnce(new Error("offline"))

    const { result } = renderHook(() => useConfirmEmailChange())

    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("reports invalid without calling the API when the token is missing", () => {
    searchParams = new URLSearchParams()

    const { result } = renderHook(() => useConfirmEmailChange())

    expect(result.current.status).toBe("invalid")
    expect(emailVerificationService.confirmEmailChange).not.toHaveBeenCalled()
  })

  it("redirects to the login page shortly after success (session was invalidated)", async () => {
    vi.useFakeTimers()
    emailVerificationService.confirmEmailChange.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useConfirmEmailChange())

    await act(async () => {})
    expect(result.current.status).toBe("success")
    expect(navigateMock).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(navigateMock).toHaveBeenCalledWith("/auth/login")
  })

  it("only sends the single-use token once even if the effect re-runs", async () => {
    emailVerificationService.confirmEmailChange.mockResolvedValue(null)

    const { result, rerender } = renderHook(() => useConfirmEmailChange())
    rerender()

    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.confirmEmailChange).toHaveBeenCalledTimes(1)
  })
})
