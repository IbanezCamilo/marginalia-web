import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { adminAuthorRequestService } from "./adminAuthorRequestService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe("adminAuthorRequestService", () => {
  it("list omits the status filter when none is given", async () => {
    await adminAuthorRequestService.list()

    expect(apiClient.get).toHaveBeenCalledWith("/admin/author-requests?page=0&size=15")
  })

  it("list includes the status filter when given", async () => {
    await adminAuthorRequestService.list("PENDING", 1, 20)

    expect(apiClient.get).toHaveBeenCalledWith(
      "/admin/author-requests?page=1&size=20&status=PENDING",
    )
  })

  it("pendingCount fetches the pending count endpoint", async () => {
    await adminAuthorRequestService.pendingCount()

    expect(apiClient.get).toHaveBeenCalledWith("/admin/author-requests/pending-count")
  })

  it("claim puts to the claim endpoint", async () => {
    await adminAuthorRequestService.claim(5)

    expect(apiClient.put).toHaveBeenCalledWith("/admin/author-requests/5/claim")
  })

  it("release deletes the claim endpoint", async () => {
    await adminAuthorRequestService.release(5)

    expect(apiClient.delete).toHaveBeenCalledWith("/admin/author-requests/5/claim")
  })

  it("approve sends the admin note, defaulting to null", async () => {
    await adminAuthorRequestService.approve(1, "Looks good")
    expect(apiClient.put).toHaveBeenCalledWith("/admin/author-requests/1/approve", {
      adminNote: "Looks good",
    })

    await adminAuthorRequestService.approve(2)
    expect(apiClient.put).toHaveBeenCalledWith("/admin/author-requests/2/approve", {
      adminNote: null,
    })
  })

  it("reject sends the admin note, defaulting to null", async () => {
    await adminAuthorRequestService.reject(1, "Not enough detail")
    expect(apiClient.put).toHaveBeenCalledWith("/admin/author-requests/1/reject", {
      adminNote: "Not enough detail",
    })

    await adminAuthorRequestService.reject(2)
    expect(apiClient.put).toHaveBeenCalledWith("/admin/author-requests/2/reject", {
      adminNote: null,
    })
  })
})
