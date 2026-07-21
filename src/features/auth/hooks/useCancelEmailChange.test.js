import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { emailVerificationService } from "@/features/auth/services/emailVerificationService"
import { ApiError } from "@/lib/apiError"
import { useCancelEmailChange } from "./useCancelEmailChange"

let searchParams = new URLSearchParams()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useSearchParams: () => [searchParams],
  }
})

vi.mock(import("@/features/auth/services/emailVerificationService"), () => ({
  emailVerificationService: { cancelEmailChange: vi.fn() },
}))

describe("useCancelEmailChange", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    searchParams = new URLSearchParams("token=cancel-raw")
  })

  it("cancels the pending change from the URL token and reports success", async () => {
    emailVerificationService.cancelEmailChange.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useCancelEmailChange())

    expect(result.current.status).toBe("cancelling")
    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.cancelEmailChange).toHaveBeenCalledWith("cancel-raw")
  })

  it("reports invalid on HTTP 400", async () => {
    emailVerificationService.cancelEmailChange.mockRejectedValueOnce(
      new ApiError({ message: "bad", status: 400, body: {} }))

    const { result } = renderHook(() => useCancelEmailChange())

    await waitFor(() => expect(result.current.status).toBe("invalid"))
  })

  it("reports a generic error on network failures", async () => {
    emailVerificationService.cancelEmailChange.mockRejectedValueOnce(new Error("offline"))

    const { result } = renderHook(() => useCancelEmailChange())

    await waitFor(() => expect(result.current.status).toBe("error"))
  })

  it("reports invalid without calling the API when the token is missing", () => {
    searchParams = new URLSearchParams()

    const { result } = renderHook(() => useCancelEmailChange())

    expect(result.current.status).toBe("invalid")
    expect(emailVerificationService.cancelEmailChange).not.toHaveBeenCalled()
  })

  it("only sends the single-use token once even if the effect re-runs", async () => {
    emailVerificationService.cancelEmailChange.mockResolvedValue(null)

    const { result, rerender } = renderHook(() => useCancelEmailChange())
    rerender()

    await waitFor(() => expect(result.current.status).toBe("success"))
    expect(emailVerificationService.cancelEmailChange).toHaveBeenCalledTimes(1)
  })
})
