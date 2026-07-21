import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { emailVerificationService } from "@/features/auth/services/emailVerificationService";
import { ApiError } from "@/lib/apiError";

/**
 * Cancels a pending email change from the old-address link on mount, reporting one of:
 * "cancelling" | "success" | "invalid" | "error".
 *
 * No redirect: the person clicking the cancel link is the current owner and may not be
 * logged in — the page just confirms the change was voided.
 */
export function useCancelEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "cancelling" : "invalid");
  // Single-use token: fire the request only once even if the effect re-runs.
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    emailVerificationService
      .cancelEmailChange(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 400) setStatus("invalid");
        else setStatus("error");
      });
  }, [token]);

  return { status };
}
