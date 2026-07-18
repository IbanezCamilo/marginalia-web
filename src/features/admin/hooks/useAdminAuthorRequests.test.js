import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService"
import { useAdminAuthorRequests } from "./useAdminAuthorRequests"

vi.mock(import("@/features/admin/services/adminAuthorRequestService"), () => ({
  adminAuthorRequestService: {
    list: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    claim: vi.fn(),
    release: vi.fn(),
  },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const PAGE_RESPONSE = {
  content: [{ id: 1, motivation: "I love writing" }],
  page: { totalElements: 1, totalPages: 1 },
}

describe("useAdminAuthorRequests", () => {
  beforeEach(() => {
    adminAuthorRequestService.list.mockResolvedValue(PAGE_RESPONSE)
    adminAuthorRequestService.claim.mockResolvedValue({})
    adminAuthorRequestService.release.mockResolvedValue(undefined)
  })

  it("loads pending requests by default on mount", async () => {
    const { result } = renderHook(() => useAdminAuthorRequests())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(adminAuthorRequestService.list).toHaveBeenCalledWith("PENDING", 0)
    expect(result.current.requests).toEqual(PAGE_RESPONSE.content)
  })

  it("reloads when the status filter changes", async () => {
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.changeFilter("APPROVED"))

    await waitFor(() => expect(adminAuthorRequestService.list).toHaveBeenCalledWith("APPROVED", 0))
  })

  it("approves a request, shows a success toast, closes the dialog, and reloads", async () => {
    adminAuthorRequestService.approve.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    // openResolve claims the request first, so it must be awaited
    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    await act(async () => {
      await result.current.confirmResolve()
    })

    expect(adminAuthorRequestService.approve).toHaveBeenCalledWith(1, "")
    expect(toast.success).toHaveBeenCalledWith("Solicitud aprobada. El usuario ahora es autor.")
    expect(result.current.resolveState.open).toBe(false)
  })

  it("rejects a request with the admin note and reloads", async () => {
    adminAuthorRequestService.reject.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.openResolve("reject", 1)
    })
    act(() => result.current.setResolveState((prev) => ({ ...prev, adminNote: "Not detailed enough" })))

    await act(async () => {
      await result.current.confirmResolve()
    })

    expect(adminAuthorRequestService.reject).toHaveBeenCalledWith(1, "Not detailed enough")
    expect(toast.success).toHaveBeenCalledWith("Solicitud rechazada.")
  })

  it("shows an error toast and keeps the dialog state when resolving fails", async () => {
    adminAuthorRequestService.approve.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    await act(async () => {
      await result.current.confirmResolve()
    })

    expect(toast.error).toHaveBeenCalledWith("No se pudo procesar la solicitud.")
    expect(result.current.resolveState.open).toBe(true)
    expect(result.current.resolving).toBe(false)
  })

  it("claims the request before opening the resolution dialog", async () => {
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    expect(adminAuthorRequestService.claim).toHaveBeenCalledWith(1)
    expect(result.current.resolveState.open).toBe(true)
  })

  it("does not open the dialog and reloads when the claim fails", async () => {
    adminAuthorRequestService.claim.mockRejectedValueOnce(new Error("claimed by someone else"))
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    adminAuthorRequestService.list.mockClear()

    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    expect(toast.error).toHaveBeenCalledWith("No se pudo reservar la solicitud.")
    expect(result.current.resolveState.open).toBe(false)
    expect(adminAuthorRequestService.list).toHaveBeenCalledWith("PENDING", 0)
  })

  it("releases the claim when the dialog is closed without resolving", async () => {
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    act(() => result.current.closeResolve())

    expect(adminAuthorRequestService.release).toHaveBeenCalledWith(1)
    expect(result.current.resolveState.open).toBe(false)
  })

  it("swallows release failures when cancelling", async () => {
    adminAuthorRequestService.release.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.openResolve("reject", 1)
    })

    await act(async () => {
      result.current.closeResolve()
    })

    expect(result.current.resolveState.open).toBe(false)
  })

  it("does not release after a successful resolution", async () => {
    adminAuthorRequestService.approve.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useAdminAuthorRequests())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => {
      await result.current.openResolve("approve", 1)
    })

    await act(async () => {
      await result.current.confirmResolve()
    })

    // The backend clears the claim as part of approve/reject
    expect(adminAuthorRequestService.release).not.toHaveBeenCalled()
  })
})
