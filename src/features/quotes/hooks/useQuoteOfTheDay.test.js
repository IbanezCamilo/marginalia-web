import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { quoteService } from "../services/quoteService"
import { useQuoteOfTheDay } from "./useQuoteOfTheDay"

vi.mock(import("../services/quoteService"), () => ({
  quoteService: { getToday: vi.fn() },
}))

describe("useQuoteOfTheDay", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("loads the quote and maps it to camelCase", async () => {
    quoteService.getToday.mockResolvedValue({
      text: "Leer es vivir dos veces.",
      author_name: "Umberto Eco",
      source_work: "El nombre de la rosa",
    })

    const { result } = renderHook(() => useQuoteOfTheDay())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.quote).toEqual({
      text: "Leer es vivir dos veces.",
      authorName: "Umberto Eco",
      sourceWork: "El nombre de la rosa",
    })
    expect(result.current.error).toBeNull()
  })

  it("maps a missing source_work to an empty string", async () => {
    quoteService.getToday.mockResolvedValue({
      text: "Una cita",
      author_name: "Autora",
    })

    const { result } = renderHook(() => useQuoteOfTheDay())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.quote).toEqual({
      text: "Una cita",
      authorName: "Autora",
      sourceWork: "",
    })
  })

  it("returns a null quote when the response has no text", async () => {
    quoteService.getToday.mockResolvedValue({ text: "", author_name: "Autora" })

    const { result } = renderHook(() => useQuoteOfTheDay())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.quote).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("returns a null quote and the error when the fetch fails", async () => {
    const failure = new Error("boom")
    quoteService.getToday.mockRejectedValue(failure)

    const { result } = renderHook(() => useQuoteOfTheDay())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.quote).toBeNull()
    expect(result.current.error).toBe(failure)
  })
})
