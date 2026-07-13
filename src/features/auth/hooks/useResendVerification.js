import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { emailVerificationService } from "@/features/auth/services/emailVerificationService";
import { getErrorMessage } from "@/lib/apiError";

const COOLDOWN_SECONDS = 60;

/**
 * Sends a new verification email with a 60-second client-side cooldown that
 * mirrors the backend throttle (the backend stays authoritative and simply
 * no-ops if this timer is bypassed).
 */
export function useResendVerification() {
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const resend = async (email) => {
    if (!email?.trim() || sending || cooldown > 0) return;

    setSending(true);
    try {
      await emailVerificationService.resend(email.trim());
      toast.success("Si el correo está registrado, recibirás un nuevo enlace de verificación.");
      startCooldown();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo reenviar el correo."));
    } finally {
      setSending(false);
    }
  };

  return { resend, sending, cooldown };
}
