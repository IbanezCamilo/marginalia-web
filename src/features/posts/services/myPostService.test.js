import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { postService } from "./myPostService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(), postForm: vi.fn() },
}))

const BASE = "/me/posts"

describe("postService", () => {
  it("getAll uses default pagination and sort", async () => {
    await postService.getAll()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=10&sort=createdAt,desc`)
  })

  it("getAll passes through explicit pagination", async () => {
    await postService.getAll(2, 5)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=2&size=5&sort=createdAt,desc`)
  })

  it("getById fetches a single post", async () => {
    await postService.getById(1)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}/1`)
  })

  describe("create", () => {
    const postData = { title: "T", content: "C", categoryId: 3, status: "DRAFT" }

    it("creates the post without uploading a cover image when none is given", async () => {
      apiClient.post.mockResolvedValueOnce({ id: 10, ...postData })

      const result = await postService.create(postData)

      expect(apiClient.post).toHaveBeenCalledWith(BASE, postData)
      expect(apiClient.postForm).not.toHaveBeenCalled()
      expect(result).toEqual({ id: 10, ...postData })
    })

    it("uploads the cover image and returns that response when a file is given", async () => {
      apiClient.post.mockResolvedValueOnce({ id: 10, ...postData })
      apiClient.postForm.mockResolvedValueOnce({ id: 10, coverImage: "cover.jpg" })
      const imageFile = new File(["x"], "cover.jpg")

      const result = await postService.create(postData, imageFile)

      expect(apiClient.post).toHaveBeenCalledWith(BASE, postData)
      const [endpoint, formData] = apiClient.postForm.mock.calls[0]
      expect(endpoint).toBe(`${BASE}/10/cover-image`)
      expect(formData.get("image")).toBe(imageFile)
      expect(result).toEqual({ id: 10, coverImage: "cover.jpg" })
    })
  })

  describe("update", () => {
    const postData = { title: "T", content: "C", categoryId: 3, status: "PUBLISHED" }

    it("updates the post without uploading a cover image when none is given", async () => {
      apiClient.put.mockResolvedValueOnce({ id: 10, ...postData })

      const result = await postService.update(10, postData)

      expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/10`, postData)
      expect(apiClient.postForm).not.toHaveBeenCalled()
      expect(result).toEqual({ id: 10, ...postData })
    })

    it("uploads the cover image and returns that response when a file is given", async () => {
      apiClient.put.mockResolvedValueOnce({ id: 10, ...postData })
      apiClient.postForm.mockResolvedValueOnce({ id: 10, coverImage: "new.jpg" })
      const imageFile = new File(["x"], "new.jpg")

      const result = await postService.update(10, postData, imageFile)

      const [endpoint, formData] = apiClient.postForm.mock.calls[0]
      expect(endpoint).toBe(`${BASE}/10/cover-image`)
      expect(formData.get("image")).toBe(imageFile)
      expect(result).toEqual({ id: 10, coverImage: "new.jpg" })
    })
  })

  it("updateStatus patches the post status", async () => {
    await postService.updateStatus(10, "PUBLISHED")

    expect(apiClient.patch).toHaveBeenCalledWith(`${BASE}/10/status`, { status: "PUBLISHED" })
  })

  it("deleteCoverImage removes only the cover image", async () => {
    await postService.deleteCoverImage(10)

    expect(apiClient.delete).toHaveBeenCalledWith(`${BASE}/10/cover-image`)
  })

  it("delete removes the post", async () => {
    await postService.delete(10)

    expect(apiClient.delete).toHaveBeenCalledWith(`${BASE}/10`)
  })
})
