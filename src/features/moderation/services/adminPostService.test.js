import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { adminPostService } from "./adminPostService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const BASE = "/admin/posts"

describe("adminPostService", () => {
  it("list omits the status filter when none is given", async () => {
    await adminPostService.list()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=20`)
  })

  it("list includes the status filter when given", async () => {
    await adminPostService.list("REJECTED", 1, 5)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=1&size=5&status=REJECTED`)
  })

  it("updateStatus sends the status and moderation note, defaulting the note to null", async () => {
    await adminPostService.updateStatus(1, "REJECTED", "Spam")
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/1/status`, {
      status: "REJECTED",
      moderationNote: "Spam",
    })

    await adminPostService.updateStatus(2, "APPROVED")
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/2/status`, {
      status: "APPROVED",
      moderationNote: null,
    })
  })

  it("reset sends the moderation note, defaulting to null", async () => {
    await adminPostService.reset(1, "Resetting")
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/1/reset`, { moderationNote: "Resetting" })

    await adminPostService.reset(2)
    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/2/reset`, { moderationNote: null })
  })

  it("remove deletes the post", async () => {
    await adminPostService.remove(1)

    expect(apiClient.delete).toHaveBeenCalledWith(`${BASE}/1`)
  })
})
