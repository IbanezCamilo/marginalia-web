import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { adminPostService } from "@/features/moderation/services/adminPostService"
import { moderatorPostService } from "@/features/moderation/services/moderatorPostService"
import { usePostModeration } from "./usePostModeration"

vi.mock(import("@/features/auth/hooks/useAuth"), () => ({
  useAuth: vi.fn(),
}))

vi.mock(import("@/features/moderation/services/adminPostService"), () => ({
  adminPostService: { list: vi.fn(), updateStatus: vi.fn(), reset: vi.fn(), remove: vi.fn() },
}))

vi.mock(import("@/features/moderation/services/moderatorPostService"), () => ({
  moderatorPostService: { list: vi.fn(), updateStatus: vi.fn(), setFeatured: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const PAGE_RESPONSE = {
  content: [{ id: 1, title: "Pending post", status: "DRAFT" }],
  page: { totalElements: 1, totalPages: 1 },
}

describe("usePostModeration", () => {
  beforeEach(() => {
    adminPostService.list.mockResolvedValue(PAGE_RESPONSE)
    moderatorPostService.list.mockResolvedValue(PAGE_RESPONSE)
  })

  it("uses the moderator service when the user is not an admin", async () => {
    useAuth.mockReturnValue({ meta: { isAdmin: false } })
    const { result } = renderHook(() => usePostModeration())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(moderatorPostService.list).toHaveBeenCalledWith("DRAFT", 0)
    expect(adminPostService.list).not.toHaveBeenCalled()
    expect(result.current.isAdmin).toBe(false)
  })

  it("uses the admin service when the user is an admin", async () => {
    useAuth.mockReturnValue({ meta: { isAdmin: true } })
    const { result } = renderHook(() => usePostModeration())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(adminPostService.list).toHaveBeenCalledWith("DRAFT", 0)
    expect(moderatorPostService.list).not.toHaveBeenCalled()
  })

  describe("confirmModeration", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ meta: { isAdmin: true } })
    })

    it("blocks rejection without a moderation note and does not call the service", async () => {
      const { result } = renderHook(() => usePostModeration())
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.openModeration("reject", 1))

      await act(async () => {
        await result.current.confirmModeration()
      })

      expect(toast.error).toHaveBeenCalledWith("La nota es obligatoria al rechazar un post.")
      expect(adminPostService.updateStatus).not.toHaveBeenCalled()
      expect(result.current.moderationState.open).toBe(true)
    })

    it.for([
      ["approve", "PUBLISHED", "Post aprobado y publicado."],
      ["archive", "ARCHIVED", "Post archivado."],
      ["toDraft", "DRAFT", "Post movido a borrador."],
    ])("maps type %s to status %s and shows the matching toast", async ([type, status, message]) => {
      const { result } = renderHook(() => usePostModeration())
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.openModeration(type, 1))

      await act(async () => {
        await result.current.confirmModeration()
      })

      expect(adminPostService.updateStatus).toHaveBeenCalledWith(1, status, "")
      expect(toast.success).toHaveBeenCalledWith(message)
      expect(result.current.moderationState.open).toBe(false)
    })

    it("rejects with the note when one is provided", async () => {
      const { result } = renderHook(() => usePostModeration())
      await waitFor(() => expect(result.current.loading).toBe(false))
      act(() => result.current.openModeration("reject", 1))
      act(() =>
        result.current.setModerationState((prev) => ({ ...prev, moderationNote: "Needs more detail" })),
      )

      await act(async () => {
        await result.current.confirmModeration()
      })

      expect(adminPostService.updateStatus).toHaveBeenCalledWith(1, "REJECTED", "Needs more detail")
      expect(toast.success).toHaveBeenCalledWith("Post rechazado.")
    })
  })

  it("confirmReset always uses adminPostService regardless of role", async () => {
    useAuth.mockReturnValue({ meta: { isAdmin: false } })
    adminPostService.reset.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => usePostModeration())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.openReset(1))

    await act(async () => {
      await result.current.confirmReset()
    })

    expect(adminPostService.reset).toHaveBeenCalledWith(1, "")
    expect(toast.success).toHaveBeenCalledWith("Post restablecido a borrador.")
  })

  describe("toggleFeatured", () => {
    it("optimistically flips the row and always uses moderatorPostService, even for admins", async () => {
      useAuth.mockReturnValue({ meta: { isAdmin: true } })
      moderatorPostService.setFeatured.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => usePostModeration())
      await waitFor(() => expect(result.current.loading).toBe(false))

      await act(async () => {
        await result.current.toggleFeatured(1, true)
      })

      expect(moderatorPostService.setFeatured).toHaveBeenCalledWith(1, true)
      expect(result.current.posts[0].featured).toBe(true)
      expect(toast.success).toHaveBeenCalledWith("Post destacado.")
    })

    it("reverts the optimistic update and shows an error toast when the request fails", async () => {
      useAuth.mockReturnValue({ meta: { isAdmin: false } })
      moderatorPostService.setFeatured.mockRejectedValueOnce(new Error("409"))
      const { result } = renderHook(() => usePostModeration())
      await waitFor(() => expect(result.current.loading).toBe(false))

      await act(async () => {
        await result.current.toggleFeatured(1, true)
      })

      expect(result.current.posts[0].featured).toBe(false)
      expect(toast.error).toHaveBeenCalled()
      expect(toast.success).not.toHaveBeenCalled()
    })
  })

  it("confirmDelete always uses adminPostService regardless of role and removes the row", async () => {
    useAuth.mockReturnValue({ meta: { isAdmin: false } })
    adminPostService.remove.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => usePostModeration())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.requestDelete(1))

    await act(async () => {
      await result.current.confirmDelete()
    })

    expect(adminPostService.remove).toHaveBeenCalledWith(1)
    expect(result.current.posts).toEqual([])
    expect(result.current.totalElements).toBe(0)
    expect(toast.success).toHaveBeenCalledWith("Post eliminado correctamente.")
  })
})
