import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { preferencesService } from "@/features/settings/services/preferencesService"
import { usePreferences } from "./usePreferences"

vi.mock(import("@/features/settings/services/preferencesService"), () => ({
  PREF_POST_MODERATION: "notifications.post-moderation",
  preferencesService: { getPreferences: vi.fn(), updatePreferences: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const KEY = "notifications.post-moderation"

describe("usePreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("loads the resolved preferences on mount", async () => {
    preferencesService.getPreferences.mockResolvedValueOnce({ [KEY]: "true" })

    const { result } = renderHook(() => usePreferences())

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.preferences).toEqual({ [KEY]: "true" })
    expect(result.current.error).toBeNull()
  })

  it("exposes an error message when loading fails", async () => {
    preferencesService.getPreferences.mockRejectedValueOnce(new Error("boom"))

    const { result } = renderHook(() => usePreferences())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.preferences).toBeNull()
  })

  it("toggle applies the server's resolved map on success", async () => {
    preferencesService.getPreferences.mockResolvedValueOnce({ [KEY]: "true" })
    preferencesService.updatePreferences.mockResolvedValueOnce({ [KEY]: "false" })

    const { result } = renderHook(() => usePreferences())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggle(KEY)
    })

    expect(preferencesService.updatePreferences).toHaveBeenCalledWith({ [KEY]: "false" })
    expect(result.current.preferences[KEY]).toBe("false")
  })

  it("toggle reverts the optimistic value and toasts on failure", async () => {
    preferencesService.getPreferences.mockResolvedValueOnce({ [KEY]: "true" })
    preferencesService.updatePreferences.mockRejectedValueOnce(new Error("boom"))

    const { result } = renderHook(() => usePreferences())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggle(KEY)
    })

    expect(result.current.preferences[KEY]).toBe("true")
    expect(toast.error).toHaveBeenCalled()
  })
})
