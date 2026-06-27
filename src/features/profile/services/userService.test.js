import { describe, expect, it, vi } from "vitest"
import { apiClient } from "@/lib/apiClient"
import { userService } from "./userService"

vi.mock(import("@/lib/apiClient"), () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), postForm: vi.fn() },
}))

const BASE = "/me/profile"

describe("userService", () => {
  it("login posts only email and password", async () => {
    await userService.login({ email: "a@b.com", password: "secret", extra: "ignored" })

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
      email: "a@b.com",
      password: "secret",
    })
  })

  it("register posts name, email, and password", async () => {
    await userService.register({ name: "Alice", email: "a@b.com", password: "secret" })

    expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
      name: "Alice",
      email: "a@b.com",
      password: "secret",
    })
  })

  it("logout posts to the logout endpoint", async () => {
    await userService.logout()

    expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {})
  })

  describe("getProfile", () => {
    it("maps the backend response to the profile shape, defaulting missing fields", async () => {
      apiClient.get.mockResolvedValueOnce({
        id: 1,
        name: "Alice",
        email: "a@b.com",
        role: "AUTHOR",
      })

      const result = await userService.getProfile()

      expect(apiClient.get).toHaveBeenCalledWith(BASE)
      expect(result).toEqual({
        userId: 1,
        name: "Alice",
        email: "a@b.com",
        description: "",
        image: null,
        role: "AUTHOR",
      })
    })

    it("maps description and image when present", async () => {
      apiClient.get.mockResolvedValueOnce({
        id: 1,
        name: "Alice",
        email: "a@b.com",
        description: "Bio",
        profilePicture: "avatar.jpg",
        role: "AUTHOR",
      })

      const result = await userService.getProfile()

      expect(result.description).toBe("Bio")
      expect(result.image).toBe("avatar.jpg")
    })
  })

  describe("updateProfile", () => {
    it("sends name and description, defaulting description to an empty string", async () => {
      apiClient.put.mockResolvedValueOnce({ name: "Alice", description: "" })

      const result = await userService.updateProfile({ name: "Alice" })

      expect(apiClient.put).toHaveBeenCalledWith(BASE, { name: "Alice", description: "" })
      expect(result).toEqual({ name: "Alice", description: "" })
    })
  })

  it("uploadProfileImage posts the image as form data", async () => {
    const imageFile = new File(["x"], "avatar.jpg")
    await userService.uploadProfileImage(imageFile)

    const [endpoint, formData] = apiClient.postForm.mock.calls[0]
    expect(endpoint).toBe(`${BASE}/image`)
    expect(formData.get("image")).toBe(imageFile)
  })

  it("deleteProfileImage deletes the profile image", async () => {
    await userService.deleteProfileImage()

    expect(apiClient.delete).toHaveBeenCalledWith(`${BASE}/image`)
  })

  it("changePassword sends the current and new password", async () => {
    await userService.changePassword("old", "new")

    expect(apiClient.put).toHaveBeenCalledWith(`${BASE}/password`, {
      currentPassword: "old",
      newPassword: "new",
    })
  })
})
