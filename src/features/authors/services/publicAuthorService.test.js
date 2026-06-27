import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { publicAuthorService } from "./publicAuthorService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn() },
}))

describe("publicAuthorService", () => {
  it("getById fetches the public author profile", async () => {
    await publicAuthorService.getById(7)

    expect(apiClient.get).toHaveBeenCalledWith("/public/authors/7")
  })

  it("getPosts uses default pagination", async () => {
    await publicAuthorService.getPosts(7)

    expect(apiClient.get).toHaveBeenCalledWith("/public/authors/7/posts?page=0&size=12")
  })

  it("getPosts passes through explicit pagination", async () => {
    await publicAuthorService.getPosts(7, 2, 5)

    expect(apiClient.get).toHaveBeenCalledWith("/public/authors/7/posts?page=2&size=5")
  })
})
