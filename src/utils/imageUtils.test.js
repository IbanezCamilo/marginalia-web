import { describe, expect, it } from "vitest"
import { BASE_URL } from "@/lib/config"
import { toCoverImageUrl, toProfileImageUrl } from "./imageUtils"

describe("toCoverImageUrl", () => {
  it("builds an image URL from a filename", () => {
    expect(toCoverImageUrl("cover.jpg")).toBe(`${BASE_URL}/api/images/cover.jpg`)
  })

  it("url-encodes special characters in the filename", () => {
    expect(toCoverImageUrl("my cover.jpg")).toBe(`${BASE_URL}/api/images/my%20cover.jpg`)
  })

  it("returns null for a falsy filename", () => {
    expect(toCoverImageUrl(null)).toBeNull()
    expect(toCoverImageUrl(undefined)).toBeNull()
    expect(toCoverImageUrl("")).toBeNull()
  })
})

describe("toProfileImageUrl", () => {
  it("returns null for a falsy value", () => {
    expect(toProfileImageUrl(null)).toBeNull()
    expect(toProfileImageUrl(undefined)).toBeNull()
    expect(toProfileImageUrl("")).toBeNull()
  })

  it("returns absolute http(s) URLs unchanged", () => {
    expect(toProfileImageUrl("https://cdn.example.com/avatar.png")).toBe(
      "https://cdn.example.com/avatar.png",
    )
  })

  it("prefixes a root-relative path with BASE_URL", () => {
    expect(toProfileImageUrl("/static/avatar.png")).toBe(`${BASE_URL}/static/avatar.png`)
  })

  it("builds an image URL from a bare filename", () => {
    expect(toProfileImageUrl("avatar.png")).toBe(`${BASE_URL}/api/images/avatar.png`)
  })
})
