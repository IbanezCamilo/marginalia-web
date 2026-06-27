import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { adminUserService } from "./adminUserService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const BASE = "/admin/users"

describe("adminUserService", () => {
  it("list uses default pagination", async () => {
    await adminUserService.list()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=20`)
  })

  it("search URL-encodes the query and applies pagination", async () => {
    await adminUserService.search("a b@c.com", 1, 5)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}/search?q=a%20b%40c.com&page=1&size=5`)
  })

  it("byRole filters by role name", async () => {
    await adminUserService.byRole("ADMIN", 1, 5)

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}/role/ADMIN?page=1&size=5`)
  })

  it("create posts the user data", async () => {
    const data = { name: "Alice" }
    await adminUserService.create(data)

    expect(apiClient.post).toHaveBeenCalledWith(BASE, data)
  })

  it("update puts the user data for the given id", async () => {
    const data = { name: "Alice Updated" }
    await adminUserService.update(1, data)

    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/1`, data)
  })

  it("remove deletes the user", async () => {
    await adminUserService.remove(1)

    expect(apiClient.delete).toHaveBeenCalledWith(`${BASE}/1`)
  })
})
