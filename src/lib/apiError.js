export class ApiError extends Error {
  constructor({ message, status = null, body = null, kind = "http" }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.kind = kind;
  }
}

export function getErrorMessage(error, fallback = "Ocurrió un error inesperado.") {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (error.kind === "network") {
    return "No pudimos conectar con el servidor. Verifica tu conexión a internet.";
  }

  if (error.kind === "timeout") {
    return "La solicitud tardó demasiado. Intenta nuevamente.";
  }

  const backendMessage = error.body?.detail || error.body?.message || error.body?.error;

  switch (error.status) {
    case 400:
      return backendMessage || "Los datos enviados no son válidos.";
    case 401:
      return backendMessage || "Tu sesión ha expirado. Inicia sesión nuevamente.";
    case 403:
      return "No tienes permiso para realizar esta acción.";
    case 404:
      return backendMessage || "No encontramos lo que buscabas.";
    case 408:
      return "La solicitud tardó demasiado. Intenta nuevamente.";
    case 409:
      return backendMessage || "Ya existe un conflicto con el estado actual.";
    case 429:
      return "Demasiadas solicitudes. Espera un momento e intenta de nuevo.";
    default:
      if (error.status >= 500) {
        return "Hubo un problema en el servidor. Intenta más tarde.";
      }
      return backendMessage || fallback;
  }
}
