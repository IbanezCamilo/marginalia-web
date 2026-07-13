import { apiClient } from "@/lib/apiClient";

export const emailVerificationService = {

  verify: (token) =>
    apiClient.post("/auth/verify-email", { token }),

  // Always resolves with 200 on the backend — it never reveals whether the
  // account exists, is already verified, or is rate-limited.
  resend: (email) =>
    apiClient.post("/auth/resend-verification", { email }),

};
