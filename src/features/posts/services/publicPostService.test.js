import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { publicPostService } from "./publicPostService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn() },
}))

const BASE = "/public/posts"

describe("publicPostService", () => {
  it("getAll uses default pagination and sort", async () => {
    await publicPostService.getAll()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=9&sort=createdAt,desc`)
  })

  it("getBySlug fetches a single post by slug", async () => {
    await publicPostService.getBySlug("my-post")

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}/my-post`)
  })

  it("getCatalog defaults sort/page/size and omits categoryId when not given", async () => {
    await publicPostService.getCatalog()

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?sort=createdAt%2Cdesc&page=0&size=12`,
    )
  })

  it("getCatalog includes categoryId when given", async () => {
    await publicPostService.getCatalog({ categoryId: 3, sort: "title,asc", page: 1, size: 6 })

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?categoryId=3&sort=title%2Casc&page=1&size=6`,
    )
  })
})
