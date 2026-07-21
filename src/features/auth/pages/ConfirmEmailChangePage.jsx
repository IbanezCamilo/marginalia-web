import { Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthResultLayout from "@/features/auth/components/AuthResultLayout";
import { useConfirmEmailChange } from "@/features/auth/hooks/useConfirmEmailChange";

const COPY = {
  confirming: {
    eyebrow: "Cambio de correo",
    title: "Un momento",
    subtitle: "Estamos confirmando tu nuevo correo electrónico.",
  },
  success: {
    eyebrow: "Cambio de correo",
    title: "Correo actualizado",
    subtitle: "Tu cuenta ahora usa tu nuevo correo electrónico.",
  },
  expired: {
    eyebrow: "Cambio de correo",
    title: "El enlace caducó",
    subtitle: "Los enlaces de confirmación duran 24 horas.",
  },
  conflict: {
    eyebrow: "Cambio de correo",
    title: "Ese correo ya está en uso",
    subtitle: "Otra cuenta registró esa dirección mientras tanto.",
  },
  invalid: {
    eyebrow: "Cambio de correo",
    title: "Enlace no válido",
    subtitle: "El enlace no es válido o ya fue utilizado.",
  },
  error: {
    eyebrow: "Cambio de correo",
    title: "Algo salió mal",
    subtitle: "No pudimos confirmar tu correo. Intenta de nuevo en unos minutos.",
  },
};

export default function ConfirmEmailChangePage() {
  const { status } = useConfirmEmailChange();
  const copy = COPY[status];

  return (
    <AuthResultLayout eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle}>
      {status === "confirming" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={15} className="animate-spin" />
          Confirmando…
        </div>
      )}

      {status === "success" && (
        <div className="space-y-5">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 size={15} className="text-rose-600 shrink-0" />
            Por seguridad cerramos tu sesión. Inicia sesión con tu nuevo correo. Te
            llevaremos allí en unos segundos.
          </p>
          <Button
            asChild
            className="h-10 w-full bg-rose-700 hover:bg-rose-800 text-white font-medium transition-colors"
          >
            <Link to="/auth/login">Iniciar sesión</Link>
          </Button>
        </div>
      )}

      {(status === "expired" || status === "conflict" || status === "invalid" || status === "error") && (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            {status === "conflict"
              ? "Puedes intentar el cambio de nuevo desde tu perfil con otra dirección."
              : status === "expired"
                ? "Vuelve a solicitar el cambio desde tu perfil para recibir un enlace nuevo."
                : "Si aún quieres cambiar tu correo, solicítalo de nuevo desde tu perfil."}
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
    </AuthResultLayout>
  );
}
