import { apiClient } from "@/lib/apiClient";

export const emailVerificationService = {

  verify: (token) =>
    apiClient.post("/auth/verify-email", { token }),

  // Always resolves with 200 on the backend — it never reveals whether the
  // account exists, is already verified, or is rate-limited.
  resend: (email) =>
    apiClient.post("/auth/resend-verification", { email }),

  // Resolves { verified: boolean }; unknown emails answer false, never 404.
  getVerificationStatus: (email) =>
    apiClient.get(`/auth/verification-status?email=${encodeURIComponent(email)}`),

  // Confirms a pending email change from the new-address link. On success the backend
  // swaps the address and invalidates the session. 400 invalid/wrong-type, 410 expired,
  // 409 the new address was taken since the request.
  confirmEmailChange: (token) =>
    apiClient.post("/auth/confirm-email-change", { token }),

  // Cancels a pending email change from the old-address link. 400 if the token is unknown.
  cancelEmailChange: (token) =>
    apiClient.post("/auth/cancel-email-change", { token }),

};
