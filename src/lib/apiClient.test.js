import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { API_URL } from "@/lib/config"
import { apiClient } from "./apiClient"

const jsonResponse = (body, { status = 200 } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  text: vi.fn().mockResolvedValue(body === undefined ? "" : JSON.stringify(body)),
})

const rawResponse = (text, { status = 200, ok = status >= 200 && status < 300 } = {}) => ({
  ok,
  status,
  text: vi.fn().mockResolvedValue(text),
})

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("apiClient happy paths", () => {
  it.for([
    { endpoint: "/posts", expectedMethod: "GET", call: () => apiClient.get("/posts") },
    { endpoint: "/posts/1", expectedMethod: "DELETE", call: () => apiClient.delete("/posts/1") },
  ])("sends a $expectedMethod request to $endpoint with no body", async ({ endpoint, expectedMethod, call }) => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))

    await call()

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`${API_URL}${endpoint}`)
    expect(options.method).toBe(expectedMethod)
    expect(options.credentials).toBe("include")
    expect(options.headers["Content-Type"]).toBe("application/json")
    expect(options.body).toBeUndefined()
  })

  it.for([
    { expectedMethod: "POST", call: () => apiClient.post("/posts", { title: "x" }) },
    { expectedMethod: "PUT", call: () => apiClient.put("/posts/1", { title: "x" }) },
    { expectedMethod: "PATCH", call: () => apiClient.patch("/posts/1", { title: "x" }) },
  ])("sends a $expectedMethod request with a JSON body", async ({ expectedMethod, call }) => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))

    await call()

    const [, options] = fetchMock.mock.calls[0]
    expect(options.method).toBe(expectedMethod)
    expect(options.headers["Content-Type"]).toBe("application/json")
    expect(options.body).toBe(JSON.stringify({ title: "x" }))
  })

  it("parses and returns the JSON response body", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1, title: "Hello" }))

    const result = await apiClient.get("/posts/1")

    expect(result).toEqual({ id: 1, title: "Hello" })
  })

  it("returns null for an empty response body", async () => {
    fetchMock.mockResolvedValueOnce(rawResponse("", { status: 204 }))

    const result = await apiClient.delete("/posts/1")

    expect(result).toBeNull()
  })

  it("sends FormData without a manual Content-Type header", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))
    const formData = new FormData()
    formData.append("file", "fake-file")

    await apiClient.postForm("/posts/1/cover", formData)

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`${API_URL}/posts/1/cover`)
    expect(options.method).toBe("POST")
    expect(options.body).toBe(formData)
    expect(options.headers["Content-Type"]).toBeUndefined()
  })
})

describe("apiClient error normalization", () => {
  it("throws an ApiError with the parsed body for a non-2xx response", async () => {
    fetchMock.mockResolvedValueOnce(
      rawResponse(JSON.stringify({ detail: "Not found" }), { status: 404 }),
    )

    await expect(apiClient.get("/posts/999")).rejects.toMatchObject({
      name: "ApiError",
      kind: "http",
      status: 404,
      body: { detail: "Not found" },
    })
  })

  it("falls back to a status-based message when the error body isn't valid JSON", async () => {
    fetchMock.mockResolvedValueOnce(rawResponse("not json", { status: 500 }))

    await expect(apiClient.get("/posts")).rejects.toMatchObject({
      status: 500,
      body: null,
      message: "not json",
    })
  })

  it("uses a generic message when the error body is empty", async () => {
    fetchMock.mockResolvedValueOnce(rawResponse("", { status: 500 }))

    await expect(apiClient.get("/posts")).rejects.toMatchObject({
      status: 500,
      body: null,
      message: "Request failed with status 500",
    })
  })

  it("wraps an AbortError as a timeout ApiError", async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error("aborted"), { name: "AbortError" }))

    await expect(apiClient.get("/posts")).rejects.toMatchObject({
      kind: "timeout",
      message: "Request timed out",
    })
  })

  it("wraps a generic fetch failure as a network ApiError", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Failed to fetch"))

    await expect(apiClient.get("/posts")).rejects.toMatchObject({
      kind: "network",
      message: "Failed to fetch",
    })
  })
})

describe("apiClient pre-auth endpoints", () => {
  it.for(["/auth/login", "/auth/register"])(
    "surfaces a 401 from %s directly, without attempting a token refresh",
    async (endpoint) => {
      fetchMock.mockResolvedValueOnce(
        rawResponse(JSON.stringify({ detail: "Bad credentials" }), { status: 401 }),
      )

      await expect(apiClient.post(endpoint, {})).rejects.toMatchObject({
        status: 401,
        body: { detail: "Bad credentials" },
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    },
  )
})

describe("apiClient refresh endpoint itself returning 401", () => {
  it("dispatches a session-expired event and throws without recursing", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")
    fetchMock.mockResolvedValueOnce(rawResponse("", { status: 401 }))

    await expect(apiClient.get("/auth/refresh")).rejects.toMatchObject({
      status: 401,
      message: "Session expired",
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "auth:session-expired" }))
  })
})

describe("apiClient 401 refresh-and-retry flow", () => {
  const setUpRefreshableFetch = () => {
    const callCounts = new Map()
    fetchMock.mockImplementation((url) => {
      const count = (callCounts.get(url) ?? 0) + 1
      callCounts.set(url, count)

      if (url === `${API_URL}/auth/refresh`) {
        return Promise.resolve(rawResponse("", { status: 200, ok: true }))
      }

      if (count === 1) {
        return Promise.resolve(rawResponse("", { status: 401, ok: false }))
      }

      return Promise.resolve(jsonResponse({ url, retried: true }))
    })
    return callCounts
  }

  it("refreshes once on a 401 and retries the original request", async () => {
    setUpRefreshableFetch()

    const result = await apiClient.get("/posts")

    expect(result).toEqual({ url: `${API_URL}/posts`, retried: true })
    expect(fetchMock).toHaveBeenCalledTimes(3)

    const refreshCall = fetchMock.mock.calls.find(([url]) => url === `${API_URL}/auth/refresh`)
    expect(refreshCall[1]).toMatchObject({ method: "POST", credentials: "include" })
  })

  it("queues concurrent 401s behind a single refresh call", async () => {
    setUpRefreshableFetch()

    const [resultA, resultB] = await Promise.all([apiClient.get("/posts"), apiClient.get("/categories")])

    expect(resultA).toEqual({ url: `${API_URL}/posts`, retried: true })
    expect(resultB).toEqual({ url: `${API_URL}/categories`, retried: true })

    const refreshCalls = fetchMock.mock.calls.filter(([url]) => url === `${API_URL}/auth/refresh`)
    expect(refreshCalls).toHaveLength(1)
  })

  it("rejects all queued requests and dispatches session-expired when the refresh itself fails", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent")
    fetchMock.mockImplementation((url) => {
      if (url === `${API_URL}/auth/refresh`) {
        return Promise.resolve(rawResponse("", { status: 401, ok: false }))
      }
      return Promise.resolve(rawResponse("", { status: 401, ok: false }))
    })

    await expect(apiClient.get("/posts")).rejects.toMatchObject({
      status: 401,
      message: "Refresh failed",
    })
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "auth:session-expired" }))
  })
})
