import { describe, expect, it } from "vitest"
import { BASE_URL } from "@/lib/config"
import { focalToObjectPosition, toCoverImageUrl, toProfileImageUrl } from "./imageUtils"

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

describe("focalToObjectPosition", () => {
  it("maps normalized coordinates to percentages", () => {
    expect(focalToObjectPosition(0, 0)).toBe("0% 0%")
    expect(focalToObjectPosition(0.5, 0.5)).toBe("50% 50%")
    expect(focalToObjectPosition(0.25, 0.75)).toBe("25% 75%")
    expect(focalToObjectPosition(1, 1)).toBe("100% 100%")
  })

  it("clamps out-of-range coordinates into [0,1]", () => {
    expect(focalToObjectPosition(-0.2, 1.4)).toBe("0% 100%")
  })

  it("centers when a coordinate is missing or invalid", () => {
    expect(focalToObjectPosition(undefined, undefined)).toBe("50% 50%")
    expect(focalToObjectPosition(null, 0.2)).toBe("50% 20%")
    expect(focalToObjectPosition(NaN, "x")).toBe("50% 50%")
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
