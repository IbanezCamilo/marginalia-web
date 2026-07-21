import { Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthResultLayout from "@/features/auth/components/AuthResultLayout";
import { useCancelEmailChange } from "@/features/auth/hooks/useCancelEmailChange";

const COPY = {
  cancelling: {
    eyebrow: "Cambio de correo",
    title: "Un momento",
    subtitle: "Estamos cancelando el cambio de correo.",
  },
  success: {
    eyebrow: "Cambio de correo",
    title: "Cambio cancelado",
    subtitle: "Tu correo actual sigue siendo el mismo. No se hizo ningún cambio.",
  },
  invalid: {
    eyebrow: "Cambio de correo",
    title: "Enlace no válido",
    subtitle: "El enlace no es válido, ya fue utilizado o el cambio ya se completó.",
  },
  error: {
    eyebrow: "Cambio de correo",
    title: "Algo salió mal",
    subtitle: "No pudimos cancelar el cambio. Intenta de nuevo en unos minutos.",
  },
};

export default function CancelEmailChangePage() {
  const { status } = useCancelEmailChange();
  const copy = COPY[status];

  return (
    <AuthResultLayout eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle}>
      {status === "cancelling" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" />
          Cancelando…
        </div>
      )}

      {status === "success" && (
        <div className="space-y-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
            Si no reconoces esta solicitud, te recomendamos cambiar tu contraseña.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/auth/login"
              className="text-rose-500 hover:text-rose-400 transition-colors"
            >
              Ir a iniciar sesión
            </Link>
          </p>
        </div>
      )}

      {(status === "invalid" || status === "error") && (
        <p className="text-center text-sm text-muted-foreground">
          <Link
            to="/auth/login"
            className="text-rose-500 hover:text-rose-400 transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </p>
      )}
    </AuthResultLayout>
  );
}
