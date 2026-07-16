import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { publicPostService } from "./publicPostService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn() },
}))

const BASE = "/public/posts"

describe("publicPostService", () => {
  it("getAll uses default pagination and the featured-first sort", async () => {
    await publicPostService.getAll()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=9&sort=featured`)
  })

  it("getBySlug fetches a single post by slug", async () => {
    await publicPostService.getBySlug("my-post")

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}/my-post`)
  })

  it("getCatalog defaults to the featured sort and omits categoryId when not given", async () => {
    await publicPostService.getCatalog()

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?sort=featured&page=0&size=12`,
    )
  })

  it("getCatalog includes categoryId and passes an explicit sort key through", async () => {
    await publicPostService.getCatalog({ categoryId: 3, sort: "title_asc", page: 1, size: 6 })

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?categoryId=3&sort=title_asc&page=1&size=6`,
    )
  })
})
