import { describe, expect, it } from "vitest"
import { ApiError, getErrorMessage } from "./apiError"

describe("ApiError", () => {
  it("defaults status, body, and kind when not provided", () => {
    const error = new ApiError({ message: "boom" })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe("ApiError")
    expect(error.message).toBe("boom")
    expect(error.status).toBeNull()
    expect(error.body).toBeNull()
    expect(error.kind).toBe("http")
  })

  it("stores the provided status, body, and kind", () => {
    const error = new ApiError({ message: "bad request", status: 400, body: { detail: "x" }, kind: "http" })

    expect(error.status).toBe(400)
    expect(error.body).toEqual({ detail: "x" })
  })
})

describe("getErrorMessage", () => {
  it("returns the fallback for non-ApiError errors", () => {
    expect(getErrorMessage(new Error("plain error"))).toBe("Ocurrió un error inesperado.")
  })

  it("returns a custom fallback when provided", () => {
    expect(getErrorMessage(new Error("plain error"), "custom fallback")).toBe("custom fallback")
  })

  it("returns a network message for network errors regardless of status", () => {
    const error = new ApiError({ message: "x", kind: "network", status: 500 })

    expect(getErrorMessage(error)).toBe(
      "No pudimos conectar con el servidor. Verifica tu conexión a internet.",
    )
  })

  it("returns a timeout message for timeout errors", () => {
    const error = new ApiError({ message: "x", kind: "timeout" })

    expect(getErrorMessage(error)).toBe("La solicitud tardó demasiado. Intenta nuevamente.")
  })

  it.for([
    [400, "Los datos enviados no son válidos."],
    [401, "Tu sesión ha expirado. Inicia sesión nuevamente."],
    [404, "No encontramos lo que buscabas."],
    [409, "Ya existe un conflicto con el estado actual."],
  ])("falls back to a default message for status %i when no backend message is present", ([status, expected]) => {
    const error = new ApiError({ message: "x", status })

    expect(getErrorMessage(error)).toBe(expected)
  })

  it.for([400, 401, 404, 409])(
    "prefers the backend detail message for status %i",
    (status) => {
      const error = new ApiError({ message: "x", status, body: { detail: "Backend says no" } })

      expect(getErrorMessage(error)).toBe("Backend says no")
    },
  )

  it("falls back to body.message when body.detail is absent", () => {
    const error = new ApiError({ message: "x", status: 400, body: { message: "from message" } })

    expect(getErrorMessage(error)).toBe("from message")
  })

  it("falls back to body.error when detail and message are absent", () => {
    const error = new ApiError({ message: "x", status: 400, body: { error: "from error" } })

    expect(getErrorMessage(error)).toBe("from error")
  })

  it("returns a fixed message for 403 regardless of backend message", () => {
    const error = new ApiError({ message: "x", status: 403, body: { detail: "ignored" } })

    expect(getErrorMessage(error)).toBe("No tienes permiso para realizar esta acción.")
  })

  it("returns a fixed message for 408 regardless of backend message", () => {
    const error = new ApiError({ message: "x", status: 408, body: { detail: "ignored" } })

    expect(getErrorMessage(error)).toBe("La solicitud tardó demasiado. Intenta nuevamente.")
  })

  it("returns a fixed message for 429 regardless of backend message", () => {
    const error = new ApiError({ message: "x", status: 429, body: { detail: "ignored" } })

    expect(getErrorMessage(error)).toBe("Demasiadas solicitudes. Espera un momento e intenta de nuevo.")
  })

  it("returns a fixed server error message for any 5xx status, ignoring backend message", () => {
    const error = new ApiError({ message: "x", status: 503, body: { detail: "ignored" } })

    expect(getErrorMessage(error)).toBe("Hubo un problema en el servidor. Intenta más tarde.")
  })

  it("falls back to the backend message or default fallback for unmapped statuses", () => {
    const withBackendMessage = new ApiError({ message: "x", status: 418, body: { detail: "teapot" } })
    const withoutBackendMessage = new ApiError({ message: "x", status: 418 })

    expect(getErrorMessage(withBackendMessage)).toBe("teapot")
    expect(getErrorMessage(withoutBackendMessage)).toBe("Ocurrió un error inesperado.")
  })
})
