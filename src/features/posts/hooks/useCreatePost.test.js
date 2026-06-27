import { act, renderHook, waitFor } from "@testing-library/react"
import { toast } from "sonner"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { categoryService } from "@/features/categories/services/categoryService"
import { postService } from "../services/myPostService"
import { useCreatePost } from "./useCreatePost"

const navigateMock = vi.fn()

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock(import("../services/myPostService"), () => ({
  postService: { create: vi.fn() },
}))

vi.mock(import("@/features/categories/services/categoryService"), () => ({
  categoryService: { getAll: vi.fn() },
}))

vi.mock(import("sonner"), () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}))

const FILLED_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
}

describe("useCreatePost", () => {
  beforeEach(() => {
    categoryService.getAll.mockResolvedValue([
      { id: 1, name: "Poetry", extra: "ignored" },
      { id: 2, name: "Essays" },
    ])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("loads and maps categories on mount", async () => {
    const { result } = renderHook(() => useCreatePost())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.categories).toEqual([
      { id: 1, name: "Poetry" },
      { id: 2, name: "Essays" },
    ])
    expect(result.current.loadError).toBeNull()
  })

  it("sets a load error when categories fail to fetch", async () => {
    categoryService.getAll.mockReset()
    categoryService.getAll.mockRejectedValueOnce(new Error("boom"))

    const { result } = renderHook(() => useCreatePost())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.loadError).toBe("No se pudieron cargar las categorías.")
  })

  it("tracks the selected image separately from post fields and submits it", async () => {
    postService.create.mockResolvedValueOnce({ id: 1 })
    const { result } = renderHook(() => useCreatePost())
    await waitFor(() => expect(result.current.loading).toBe(false))

    const file = new File(["x"], "cover.jpg")
    act(() => {
      result.current.handleChange("title", "Draft title")
      result.current.handleChange("image", file)
    })
    expect(result.current.post.image).toBe("")

    await act(async () => {
      await result.current.handleOnSubmit(undefined, "DRAFT")
    })

    expect(postService.create).toHaveBeenCalledWith(expect.anything(), file)
  })

  it("blocks submission and warns when validation fails", async () => {
    const { result } = renderHook(() => useCreatePost())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleOnSubmit(undefined, "PUBLISHED")
    })

    expect(toast.warning).toHaveBeenCalled()
    expect(postService.create).not.toHaveBeenCalled()
  })

  it("submits a valid post, trims the title, and redirects after a delay", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    postService.create.mockResolvedValueOnce({ id: 1 })
    const { result } = renderHook(() => useCreatePost())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleChange("title", "  My Title  ")
      result.current.handleChange("content", FILLED_CONTENT)
      result.current.handleChange("categoryId", "1")
    })

    await act(async () => {
      await result.current.handleOnSubmit(undefined, "PUBLISHED")
    })

    expect(postService.create).toHaveBeenCalledWith(
      { title: "My Title", content: FILLED_CONTENT, categoryId: 1, status: "PUBLISHED" },
      null,
    )
    expect(toast.success).toHaveBeenCalledWith("Post Publicado exitosamente!")
    expect(result.current.post.title).toBe("")
    expect(navigateMock).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    expect(navigateMock).toHaveBeenCalledWith("/user/posts")
  })

  it("uses the draft success message and keeps null categoryId when none is selected", async () => {
    postService.create.mockResolvedValueOnce({ id: 1 })
    const { result } = renderHook(() => useCreatePost())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.handleChange("title", "Draft title"))

    await act(async () => {
      await result.current.handleOnSubmit(undefined, "DRAFT")
    })

    expect(postService.create).toHaveBeenCalledWith(
      { title: "Draft title", content: "", categoryId: null, status: "DRAFT" },
      null,
    )
    expect(toast.success).toHaveBeenCalledWith("Post Guardado como borrador exitosamente!")
  })

  it("surfaces an error and does not redirect when the create call fails", async () => {
    postService.create.mockRejectedValueOnce(new Error("boom"))
    const { result } = renderHook(() => useCreatePost())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.handleChange("title", "Draft title")
    })

    await act(async () => {
      await result.current.handleOnSubmit(undefined, "DRAFT")
    })

    expect(result.current.submitError).toBe("No se pudo crear el post.")
    expect(toast.error).toHaveBeenCalledWith("No se pudo crear el post.")
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
