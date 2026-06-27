import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService"
import { useAdminAuthorRequests } from "./useAdminAuthorRequests"

vi.mock(import("@/features/admin/services/adminAuthorRequestService"), () => ({
  adminAuthorRequestService: { list: vi.fn(), approve: vi.fn(), reject: vi.fn() },
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
    act(() => result.current.openResolve("approve", 1))

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
    act(() => result.current.openResolve("reject", 1))
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
    act(() => result.current.openResolve("approve", 1))

    await act(async () => {
      await result.current.confirmResolve()
    })

    expect(toast.error).toHaveBeenCalledWith("No se pudo procesar la solicitud.")
    expect(result.current.resolveState.open).toBe(true)
    expect(result.current.resolving).toBe(false)
  })
})
