import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { postService } from "../services/myPostService"
import { useMyPosts } from "./useMyPosts"

vi.mock(import("../services/myPostService"), () => ({
  postService: { getAll: vi.fn(), delete: vi.fn(), updateStatus: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const PAGE_RESPONSE = {
  content: [
    { id: 1, title: "First post", status: "PUBLISHED" },
    { id: 2, title: "Second post", status: "DRAFT" },
  ],
  page: { totalPages: 3, totalElements: 25 },
}

describe("useMyPosts", () => {
  beforeEach(() => {
    postService.getAll.mockResolvedValue(PAGE_RESPONSE)
  })

  it("loads posts for the given page and exposes pagination metadata", async () => {
    const { result } = renderHook(() => useMyPosts(0))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(postService.getAll).toHaveBeenCalledWith(0, 10)
    expect(result.current.posts).toEqual(PAGE_RESPONSE.content)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.totalElements).toBe(25)
    expect(result.current.error).toBeNull()
  })

  it("reloads when currentPage changes", async () => {
    const { rerender } = renderHook(({ page }) => useMyPosts(page), { initialProps: { page: 0 } })
    await waitFor(() => expect(postService.getAll).toHaveBeenCalledWith(0, 10))

    rerender({ page: 1 })
    await waitFor(() => expect(postService.getAll).toHaveBeenCalledWith(1, 10))
  })

  it("sets an error message when loading fails", async () => {
    postService.getAll.mockReset()
    postService.getAll.mockRejectedValueOnce(new Error("boom"))

    const { result } = renderHook(() => useMyPosts(0))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe("No se pudieron cargar los posts.")
    expect(result.current.posts).toEqual([])
  })

  describe("delete flow", () => {
    it("requestDeletePost opens the confirm dialog for the given post", async () => {
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))

      act(() => result.current.requestDeletePost(1))

      expect(result.current.confirmState).toMatchObject({ open: true, postId: 1, type: "delete" })
    })

    it("removes the post and decrements totalElements on success", async () => {
      postService.delete.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.requestDeletePost(1))

      await act(async () => {
        await result.current.handleConfirm()
      })

      expect(postService.delete).toHaveBeenCalledWith(1)
      expect(result.current.posts.map((p) => p.id)).toEqual([2])
      expect(result.current.totalElements).toBe(24)
      expect(toast.success).toHaveBeenCalledWith("Post eliminado correctamente")
      expect(result.current.confirmState.open).toBe(false)
    })

    it("keeps the dialog open and shows an error toast on failure", async () => {
      postService.delete.mockRejectedValueOnce(new Error("boom"))
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.requestDeletePost(1))

      await act(async () => {
        await result.current.handleConfirm()
      })

      expect(result.current.posts).toHaveLength(2)
      expect(toast.error).toHaveBeenCalledWith("No se pudo eliminar el post.")
      expect(result.current.confirmState.open).toBe(true)
    })
  })

  describe("toggleStatus flow", () => {
    it("optimistically updates status and confirms on success", async () => {
      postService.updateStatus.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.requestToggleStatus(2, "DRAFT"))

      await act(async () => {
        await result.current.handleConfirm()
      })

      expect(postService.updateStatus).toHaveBeenCalledWith(2, "PUBLISHED")
      expect(result.current.posts.find((p) => p.id === 2).status).toBe("PUBLISHED")
      expect(toast.success).toHaveBeenCalledWith("Post publicado")
      expect(result.current.confirmState.open).toBe(false)
    })

    it("reverts the optimistic update and shows an error toast on failure", async () => {
      postService.updateStatus.mockRejectedValueOnce(new Error("boom"))
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.requestToggleStatus(2, "DRAFT"))

      await act(async () => {
        await result.current.handleConfirm()
      })

      expect(result.current.posts.find((p) => p.id === 2).status).toBe("DRAFT")
      expect(toast.error).toHaveBeenCalledWith("No se pudo cambiar el estado del post.")
    })

    it("uses the rejected-specific success message when moving a rejected post back to draft", async () => {
      postService.updateStatus.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => useMyPosts(0))
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.requestToggleStatus(2, "REJECTED"))

      await act(async () => {
        await result.current.handleConfirm()
      })

      expect(postService.updateStatus).toHaveBeenCalledWith(2, "DRAFT")
      expect(toast.success).toHaveBeenCalledWith(
        "Post movido a borrador. Ya puedes editarlo y reenviarlo.",
      )
    })
  })
})
