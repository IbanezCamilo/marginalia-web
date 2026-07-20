import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { PREF_POST_MODERATION, preferencesService } from "./preferencesService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), put: vi.fn() },
}))

describe("preferencesService", () => {
  it("exposes the post-moderation preference key", () => {
    expect(PREF_POST_MODERATION).toBe("notifications.post-moderation")
  })

  it("getPreferences fetches the resolved map", async () => {
    apiClient.get.mockResolvedValueOnce({ "notifications.post-moderation": "true" })

    const result = await preferencesService.getPreferences()

    expect(apiClient.get).toHaveBeenCalledWith("/me/preferences")
    expect(result).toEqual({ "notifications.post-moderation": "true" })
  })

  it("updatePreferences puts the partial map and returns the resolved map", async () => {
    apiClient.put.mockResolvedValueOnce({ "notifications.post-moderation": "false" })

    const result = await preferencesService.updatePreferences({
      "notifications.post-moderation": "false",
    })

    expect(apiClient.put).toHaveBeenCalledWith("/me/preferences", {
      "notifications.post-moderation": "false",
    })
    expect(result).toEqual({ "notifications.post-moderation": "false" })
  })
})
