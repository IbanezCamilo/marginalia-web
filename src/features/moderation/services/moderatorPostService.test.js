import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { moderatorPostService } from "./moderatorPostService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}))

const BASE = "/moderator/posts"

describe("moderatorPostService", () => {
  it("list omits the status filter when none is given", async () => {
    await moderatorPostService.list()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=20`)
  })

  it("list includes the status filter when given", async () => {
    await moderatorPostService.list("PENDING", 1, 5)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=1&size=5&status=PENDING`)
  })

  it("updateStatus sends the status and moderation note, defaulting the note to null", async () => {
    await moderatorPostService.updateStatus(1, "APPROVED", "Looks good")
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/1/status`, {
      status: "APPROVED",
      moderationNote: "Looks good",
    })

    await moderatorPostService.updateStatus(2, "REJECTED")
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/2/status`, {
      status: "REJECTED",
      moderationNote: null,
    })
  })

  it("setFeatured sends the featured flag to the featured endpoint", async () => {
    await moderatorPostService.setFeatured(1, true)
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/1/featured`, { featured: true })

    await moderatorPostService.setFeatured(2, false)
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/2/featured`, { featured: false })
  })
})
