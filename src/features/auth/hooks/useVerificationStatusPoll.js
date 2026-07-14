import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { emailVerificationService } from "@/features/auth/services/emailVerificationService";

// The backend rate-limits all of /api/auth/* to 10 requests/min per IP, shared
// with resend and login: 12s (5/min) leaves headroom for both.
const POLL_INTERVAL_MS = 12_000;
// Returning to the tab triggers an instant check, but never more often than
// this — rapid tab switching must not burn the shared rate-limit budget.
const MIN_VISIBILITY_GAP_MS = 5_000;

// Written by useRegister so the check-email page can keep polling (and the
// resend form stays prefilled) after a refresh loses the router state.
export const PENDING_VERIFICATION_EMAIL_KEY = "pendingVerificationEmail";

/**
 * Polls the public verification-status endpoint while the check-email page is
 * open, so verifying from another device redirects this one to login too.
 *
 * Polling pauses while the tab is hidden and fires an immediate check when it
 * becomes visible again. On verified: toast + navigate("/auth/login") with no
 * delay — unlike useVerifyEmail's 2.5s pause there is no success screen to
 * read here, the user is just waiting.
 */
export function useVerificationStatusPoll(email) {
  const navigate = useNavigate();
  // Refs survive StrictMode's mount → unmount → mount, so the gap guard also
  // collapses the double-fired mount check into a single request.
  const lastCheckAtRef = useRef(0);
  const inFlightRef = useRef(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const trimmed = email?.trim();
    if (!trimmed || doneRef.current) return undefined;

    let intervalId = null;
    const stopInterval = () => {
      clearInterval(intervalId);
      intervalId = null;
    };

    const check = async () => {
      if (inFlightRef.current || doneRef.current) return;
      inFlightRef.current = true;
      lastCheckAtRef.current = Date.now();
      try {
        const { verified } = await emailVerificationService.getVerificationStatus(trimmed);
        if (verified) {
          doneRef.current = true;
          stopInterval();
          sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
          toast.success("Tu correo ha sido verificado. Ya puedes iniciar sesión.");
          navigate("/auth/login");
        }
      } catch {
        // Silent: a failed check (offline, 429) just waits for the next tick.
      } finally {
        inFlightRef.current = false;
      }
    };

    const guardedCheck = () => {
      if (Date.now() - lastCheckAtRef.current >= MIN_VISIBILITY_GAP_MS) check();
    };

    const startInterval = () => {
      if (intervalId === null) intervalId = setInterval(check, POLL_INTERVAL_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopInterval();
      } else {
        guardedCheck();
        startInterval();
      }
    };

    guardedCheck();
    if (document.visibilityState !== "hidden") startInterval();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [email, navigate]);
}
