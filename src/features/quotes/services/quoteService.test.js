import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { QUOTES_URL } from "@/lib/config"
import { quoteService } from "./quoteService"

const jsonResponse = (body, { status = 200 } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(body),
})

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("quoteService.getToday", () => {
  it("fetches the quote from the edge endpoint without credentials", async () => {
    const quote = { text: "Una cita", author_name: "Autora", source_work: "" }
    fetchMock.mockResolvedValueOnce(jsonResponse(quote))

    const result = await quoteService.getToday()

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`${QUOTES_URL}/quotes/today`)
    expect(options.credentials).toBeUndefined()
    expect(result).toEqual(quote)
  })

  it("throws on a non-2xx response", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(null, { status: 500 }))

    await expect(quoteService.getToday()).rejects.toThrow("status 500")
  })

  it("propagates network errors", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"))

    await expect(quoteService.getToday()).rejects.toThrow("Failed to fetch")
  })
})
