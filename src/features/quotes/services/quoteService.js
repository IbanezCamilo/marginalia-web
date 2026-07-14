import { QUOTES_URL } from "@/lib/config";

// The quotes endpoint lives on the edge Worker, a different origin from the
// backend API, so it bypasses apiClient (which prepends API_URL and sends
// credentials). No custom headers: keeps it a simple request without preflight.
export const quoteService = {
  getToday: async () => {
    const response = await fetch(`${QUOTES_URL}/quotes/today`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`Quote request failed with status ${response.status}`);
    }
    return response.json();
  },
};
