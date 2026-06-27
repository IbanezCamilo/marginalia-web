import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { categoryService } from "./categoryService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe("categoryService", () => {
  it("getAll fetches the public category list", async () => {
    apiClient.get.mockResolvedValueOnce([{ id: 1 }])

    const result = await categoryService.getAll()

    expect(apiClient.get).toHaveBeenCalledWith("/public/categories")
    expect(result).toEqual([{ id: 1 }])
  })

  it("getById fetches a single public category", async () => {
    apiClient.get.mockResolvedValueOnce({ id: 1 })

    await categoryService.getById(1)

    expect(apiClient.get).toHaveBeenCalledWith("/public/categories/1")
  })

  it("create sends only the category name to the admin endpoint", async () => {
    await categoryService.create({ name: "Poetry", extraField: "ignored" })

    expect(apiClient.post).toHaveBeenCalledWith("/admin/categories", { name: "Poetry" })
  })

  it("update sends only the category name to the admin endpoint", async () => {
    await categoryService.update(1, { name: "Renamed", extraField: "ignored" })

    expect(apiClient.put).toHaveBeenCalledWith("/admin/categories/1", { name: "Renamed" })
  })

  it("delete removes a category via the admin endpoint", async () => {
    await categoryService.delete(1)

    expect(apiClient.delete).toHaveBeenCalledWith("/admin/categories/1")
  })
})
