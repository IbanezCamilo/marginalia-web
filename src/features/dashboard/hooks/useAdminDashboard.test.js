import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { userService } from "@/features/profile/services/userService"
import { postService } from "@/features/posts/services/myPostService"
import { categoryService } from "@/features/categories/services/categoryService"
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService"
import { adminUserService } from "@/features/admin/services/adminUserService"
import { adminPostService } from "@/features/moderation/services/adminPostService"
import { useAdminDashboard } from "./useAdminDashboard"

vi.mock(import("@/features/profile/services/userService"), () => ({
  userService: { getProfile: vi.fn() },
}))
vi.mock(import("@/features/posts/services/myPostService"), () => ({
  postService: { getAll: vi.fn() },
}))
vi.mock(import("@/features/categories/services/categoryService"), () => ({
  categoryService: { getAll: vi.fn() },
}))
vi.mock(import("@/features/admin/services/adminAuthorRequestService"), () => ({
  adminAuthorRequestService: { pendingCount: vi.fn() },
}))
vi.mock(import("@/features/admin/services/adminUserService"), () => ({
  adminUserService: { list: vi.fn(), byRole: vi.fn() },
}))
vi.mock(import("@/features/moderation/services/adminPostService"), () => ({
  adminPostService: { list: vi.fn() },
}))

const setUpHappyPath = () => {
  userService.getProfile.mockResolvedValue({ id: 1, name: "Admin" })
  adminAuthorRequestService.pendingCount.mockResolvedValue(4)
  adminPostService.list.mockResolvedValue({ page: { totalElements: 7 } })
  adminUserService.list.mockResolvedValue({ page: { totalElements: 50 } })
  categoryService.getAll.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }])
  postService.getAll.mockResolvedValue({
    content: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  })
  adminUserService.byRole.mockResolvedValue({ page: { totalElements: 2 } })
}

describe("useAdminDashboard", () => {
  beforeEach(() => {
    setUpHappyPath()
  })

  it("does not fetch the admin team or count it when includeAdminTeam is not set", async () => {
    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(adminUserService.byRole).not.toHaveBeenCalled()
    expect(result.current.stats.adminCount).toBe(0)
  })

  it("fetches and counts the admin team when includeAdminTeam is true", async () => {
    const { result } = renderHook(() => useAdminDashboard({ includeAdminTeam: true }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(adminUserService.byRole).toHaveBeenCalledWith("ADMIN", 0, 1)
    expect(result.current.stats.adminCount).toBe(2)
  })

  it("maps every stat from the correct response shape", async () => {
    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toEqual({ id: 1, name: "Admin" })
    expect(result.current.stats).toMatchObject({
      pendingRequests: 4,
      moderationQueue: 7,
      totalUsers: 50,
      categoryCount: 3,
    })
  })

  it("slices ownPosts to the preview count but reports hasOwnPosts from the full list", async () => {
    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.ownPosts).toHaveLength(3)
    expect(result.current.hasOwnPosts).toBe(true)
  })

  it("reports no own posts when the list is empty", async () => {
    postService.getAll.mockResolvedValueOnce({ content: [] })
    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.ownPosts).toEqual([])
    expect(result.current.hasOwnPosts).toBe(false)
  })

  it("sets an error and stops loading when any request fails", async () => {
    categoryService.getAll.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useAdminDashboard())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe("No se pudo cargar la información.")
  })
})
