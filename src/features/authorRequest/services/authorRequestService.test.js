import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { authorRequestService } from "./authorRequestService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

describe("authorRequestService", () => {
  it("submit posts the motivation", async () => {
    await authorRequestService.submit("I love writing")

    expect(apiClient.post).toHaveBeenCalledWith("/me/author-request", {
      motivation: "I love writing",
    })
  })

  it("getActive fetches the active request", async () => {
    await authorRequestService.getActive()

    expect(apiClient.get).toHaveBeenCalledWith("/me/author-request/active")
  })

  it("getHistory uses default pagination and sort", async () => {
    await authorRequestService.getHistory()

    expect(apiClient.get).toHaveBeenCalledWith(
      "/me/author-request/history?page=0&size=10&sort=createdAt,desc",
    )
  })

  it("getHistory passes through explicit pagination and sort", async () => {
    await authorRequestService.getHistory(2, 5, "createdAt,asc")

    expect(apiClient.get).toHaveBeenCalledWith(
      "/me/author-request/history?page=2&size=5&sort=createdAt,asc",
    )
  })
})
