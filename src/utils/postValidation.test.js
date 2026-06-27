import { describe, expect, it } from "vitest"
import { validatePost } from "./postValidation"

const FILLED_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello world" }] }],
}

const EMPTY_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
}

describe("validatePost", () => {
  describe("PUBLISHED", () => {
    it("is valid when title, content, and categoryId are all present", () => {
      const result = validatePost(
        { title: "A valid title", content: FILLED_CONTENT, categoryId: 1 },
        "PUBLISHED",
      )

      expect(result).toEqual({ isValid: true, errors: [] })
    })

    it("requires a title", () => {
      const result = validatePost(
        { title: "", content: FILLED_CONTENT, categoryId: 1 },
        "PUBLISHED",
      )

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("El titulo es obligatorio para publicar")
    })

    it("treats a whitespace-only title as missing", () => {
      const result = validatePost(
        { title: "   ", content: FILLED_CONTENT, categoryId: 1 },
        "PUBLISHED",
      )

      expect(result.errors).toContain("El titulo es obligatorio para publicar")
    })

    it("requires the title to be at least 5 characters", () => {
      const result = validatePost(
        { title: "Hi", content: FILLED_CONTENT, categoryId: 1 },
        "PUBLISHED",
      )

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("El titulo debe tener al menos 5 caracteres")
    })

    it("requires content", () => {
      const result = validatePost(
        { title: "A valid title", content: EMPTY_CONTENT, categoryId: 1 },
        "PUBLISHED",
      )

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("El contenido es obligatorio para publicar")
    })

    it("requires a categoryId", () => {
      const result = validatePost(
        { title: "A valid title", content: FILLED_CONTENT, categoryId: null },
        "PUBLISHED",
      )

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Debes seleccionar una categoria")
    })

    it("collects every missing-field error at once", () => {
      const result = validatePost({ title: "", content: null, categoryId: null }, "PUBLISHED")

      expect(result.errors).toHaveLength(3)
    })
  })

  describe("DRAFT", () => {
    it("is invalid when both title and content are missing", () => {
      const result = validatePost({ title: "", content: EMPTY_CONTENT }, "DRAFT")

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Un borrador debe tener al menos titulo o contenido")
    })

    it("is valid with only a title", () => {
      const result = validatePost({ title: "Draft title", content: null }, "DRAFT")

      expect(result).toEqual({ isValid: true, errors: [] })
    })

    it("is valid with only content", () => {
      const result = validatePost({ title: "", content: FILLED_CONTENT }, "DRAFT")

      expect(result).toEqual({ isValid: true, errors: [] })
    })

    it("does not require a categoryId", () => {
      const result = validatePost(
        { title: "Draft title", content: FILLED_CONTENT, categoryId: null },
        "DRAFT",
      )

      expect(result.isValid).toBe(true)
    })
  })

  it("returns no errors for an unrecognized status", () => {
    const result = validatePost({ title: "", content: null, categoryId: null }, "ARCHIVED")

    expect(result).toEqual({ isValid: true, errors: [] })
  })
})
