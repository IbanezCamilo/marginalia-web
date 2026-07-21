import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailVerificationService } from "@/features/auth/services/emailVerificationService";
import { ApiError } from "@/lib/apiError";

const REDIRECT_DELAY_MS = 3000;

/**
 * Confirms the emailed change token on mount and reports one of:
 * "confirming" | "success" | "expired" | "conflict" | "invalid" | "error".
 *
 * "expired" (410) and "conflict" (409, the new address was taken since the request)
 * are separated from "invalid" (400) so the page can explain each case. On success the
 * backend has swapped the address and invalidated the session, so the user is sent to
 * the login page after a short pause to sign in with the new email.
 */
export function useConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "confirming" : "invalid");
  const navigate = useNavigate();
  // Single-use token: StrictMode's double effect would consume it then fail the second
  // call, so the request must only ever fire once.
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    emailVerificationService
      .confirmEmailChange(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) setStatus("expired");
        else if (err instanceof ApiError && err.status === 409) setStatus("conflict");
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
