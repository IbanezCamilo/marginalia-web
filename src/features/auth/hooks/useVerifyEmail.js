import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailVerificationService } from "@/features/auth/services/emailVerificationService";
import { ApiError } from "@/lib/apiError";

const REDIRECT_DELAY_MS = 2500;

/**
 * Verifies the emailed token on mount and reports one of:
 * "verifying" | "success" | "expired" | "invalid" | "error".
 *
 * "expired" (HTTP 410) is separated from "invalid" (400) so the page can
 * offer a resend for links that simply aged out. On success the user is
 * redirected to the login page after a short pause.
 */
export function useVerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "verifying" : "invalid");
  const navigate = useNavigate();
  // The token is single-use: StrictMode's double effect would consume it and
  // then fail the second call, so the request must only ever fire once.
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    emailVerificationService
      .verify(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) setStatus("expired");
        else if (err instanceof ApiError && err.status === 400) setStatus("invalid");
        else setStatus("error");
      });
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;
    const timeout = setTimeout(() => navigate("/auth/login"), REDIRECT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [status, navigate]);

  return { status };
}
