import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { adminUserService } from "@/features/admin/services/adminUserService"
import { useAdminUsers } from "./useAdminUsers"

vi.mock(import("@/features/admin/services/adminUserService"), () => ({
  adminUserService: {
    list: vi.fn(),
    search: vi.fn(),
    byRole: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const PAGE_RESPONSE = {
  content: [
    { id: 1, name: "Alice", role: "AUTHOR" },
    { id: 2, name: "Bob", role: "READER" },
  ],
  page: { totalElements: 12, totalPages: 1 },
}

describe("useAdminUsers", () => {
  beforeEach(() => {
    adminUserService.list.mockResolvedValue(PAGE_RESPONSE)
    adminUserService.search.mockResolvedValue(PAGE_RESPONSE)
    adminUserService.byRole.mockResolvedValue(PAGE_RESPONSE)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("loads the default user list on mount", async () => {
    const { result } = renderHook(() => useAdminUsers())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(adminUserService.list).toHaveBeenCalledWith(0)
    expect(result.current.users).toEqual(PAGE_RESPONSE.content)
    expect(result.current.totalElements).toBe(12)
  })

  it("does not search until the debounce delay has elapsed", async () => {
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    adminUserService.list.mockClear()

    vi.useFakeTimers()
    act(() => result.current.changeSearch("Alice"))
    expect(adminUserService.search).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(399))
    expect(adminUserService.search).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(1)
      await Promise.resolve()
    })
    expect(adminUserService.search).toHaveBeenCalledWith("Alice", 0)
  })

  it("clears an active role filter when searching", async () => {
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.changeRoleFilter("ADMIN"))
    expect(result.current.roleFilter).toBe("ADMIN")

    act(() => result.current.changeSearch("Alice"))
    expect(result.current.roleFilter).toBeNull()
  })

  it("clears the search input when filtering by role", async () => {
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.changeSearch("Alice"))
    act(() => result.current.changeRoleFilter("MODERATOR"))

    expect(result.current.searchInput).toBe("")
    await waitFor(() => expect(adminUserService.byRole).toHaveBeenCalledWith("MODERATOR", 0))
  })

  it("submitCreate creates the user, closes the dialog, and reloads", async () => {
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setCreateOpen(true))
    adminUserService.list.mockClear()

    await act(async () => {
      await result.current.submitCreate({ name: "New User" })
    })

    expect(adminUserService.create).toHaveBeenCalledWith({ name: "New User" })
    expect(toast.success).toHaveBeenCalledWith("Usuario creado correctamente.")
    expect(result.current.createOpen).toBe(false)
    expect(adminUserService.list).toHaveBeenCalledWith(0)
  })

  it("submitEdit patches the row in place and closes the edit dialog", async () => {
    adminUserService.update.mockResolvedValueOnce({ id: 1, name: "Alice Updated", role: "AUTHOR" })
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.openEdit(result.current.users[0]))

    await act(async () => {
      await result.current.submitEdit(1, { name: "Alice Updated" })
    })

    expect(result.current.users.find((u) => u.id === 1).name).toBe("Alice Updated")
    expect(toast.success).toHaveBeenCalledWith("Usuario actualizado correctamente.")
    expect(result.current.editState.open).toBe(false)
  })

  it("confirmDelete closes the dialog immediately, then removes the user on success", async () => {
    adminUserService.remove.mockResolvedValueOnce(undefined)
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.requestDelete(1))

    await act(async () => {
      await result.current.confirmDelete()
    })

    expect(result.current.confirmDeleteState.open).toBe(false)
    expect(result.current.users.map((u) => u.id)).toEqual([2])
    expect(result.current.totalElements).toBe(11)
    expect(toast.success).toHaveBeenCalledWith("Usuario eliminado correctamente.")
  })

  it("confirmDelete closes the dialog immediately even when the removal fails", async () => {
    adminUserService.remove.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useAdminUsers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.requestDelete(1))

    await act(async () => {
      await result.current.confirmDelete()
    })

    expect(result.current.confirmDeleteState.open).toBe(false)
    expect(result.current.users).toHaveLength(2)
    expect(toast.error).toHaveBeenCalledWith("No se pudo eliminar el usuario.")
  })
})
