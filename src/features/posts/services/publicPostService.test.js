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

  it("getCatalog sends any filter params generically, skipping null/empty ones", async () => {
    await publicPostService.getCatalog({
      category: "ficcion",
      time: "short",
      authorId: "7",
      q: "borges",
      sort: "recent",
      categoryId: null,
      page: 1,
      size: 6,
    })

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?category=ficcion&time=short&authorId=7&q=borges&sort=recent&page=1&size=6`,
    )
  })

  it("getCatalog defaults to page 0 size 12 with no filters", async () => {
    await publicPostService.getCatalog()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=12`)
  })
})
