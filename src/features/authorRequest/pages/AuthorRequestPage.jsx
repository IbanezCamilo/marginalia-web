import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthorRequest } from "@/features/authorRequest/hooks/useAuthorRequest";

const STATUS_BADGE = {
  PENDING:  "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

const STATUS_LABEL = {
  PENDING:  "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const formatDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr))
    : "—";

export default function AuthorRequestPage() {
  const { state: { user, loading: authLoading } } = useAuth();
  const { activeRequest, history, motivation, setMotivation, loading, submitting, submit } = useAuthorRequest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && user.role !== "READER") {
      navigate("/user/dashboard", { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <div className="h-32 animate-pulse rounded-xl bg-stone-200" />
        <div className="h-48 animate-pulse rounded-xl bg-stone-100" />
      </div>
    );
  }

  const isPending  = activeRequest?.status === "PENDING";
  const isRejected = activeRequest?.status === "REJECTED";
  const showForm   = !activeRequest || isRejected;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">

      {/* Header */}
      <div className="rounded-xl border border-stone-200 bg-surface-warm p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-stone-200 bg-stone-50">
            <BadgeCheck size={22} className="text-stone-600" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
              Cuenta
            </p>
            <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">
              Ser Autor
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Los autores pueden publicar artículos y reseñas en Marginalia.
            </p>
          </div>
        </div>
      </div>

      {/* PENDING state */}
      {isPending && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Clock size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-medium text-amber-800">Solicitud en revisión</p>
              <p className="text-sm text-amber-700">
                Tu solicitud fue enviada y está siendo revisada por el equipo de Marginalia.
                Te notificaremos cuando haya una respuesta.
              </p>
              {activeRequest.motivation && (
                <div className="mt-3 rounded-md border border-amber-200 bg-amber-100/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-amber-600">
                    Tu motivación
                  </p>
                  <p className="mt-1 text-sm text-amber-800 italic">
                    "{activeRequest.motivation}"
                  </p>
                </div>
              )}
              <p className="pt-2 text-xs text-amber-600">
                Enviada el{" "}
                {new Date(activeRequest.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* REJECTED notice */}
      {isRejected && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <p className="font-medium text-rose-800">Solicitud rechazada</p>
              <p className="text-sm text-rose-700">
                Tu solicitud anterior no fue aprobada. Puedes enviar una nueva solicitud.
              </p>
              {activeRequest.adminNote && (
                <div className="mt-3 rounded-md border border-rose-200 bg-rose-100/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-rose-600">
                    Motivo
                  </p>
                  <p className="mt-1 text-sm text-rose-800 italic">
                    "{activeRequest.adminNote}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="font-medium text-stone-900">Solicitar acceso de autor</p>
              <p className="text-sm text-stone-500">
                Cuéntanos por qué quieres publicar en Marginalia. La motivación es opcional.
              </p>
            </div>

            <div className="border-t border-stone-100" />

            <div className="space-y-1.5">
              <Label
                htmlFor="motivation"
                className="text-xs uppercase tracking-wide text-stone-500"
              >
                Motivación{" "}
                <span className="normal-case tracking-normal text-stone-400">(opcional)</span>
              </Label>
              <Textarea
                id="motivation"
                placeholder="Comparte qué tipo de contenido literario quieres crear…"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                disabled={submitting}
                maxLength={500}
                rows={4}
                className="resize-none border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400
                           focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
              />
              <p className="text-right text-xs text-stone-400">
                {motivation.length}/500
              </p>
            </div>

            <Button
              onClick={submit}
              disabled={submitting}
              className="h-10 w-full bg-rose-700 hover:bg-rose-800 text-white disabled:opacity-50 font-medium transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Enviar solicitud
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-xl text-stone-950">Historial de solicitudes</h2>
          <ul className="mt-4 space-y-3">
            {history.map((req) => (
              <li
                key={req.id}
                className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs text-stone-400">{formatDate(req.createdAt)}</p>
                    {req.motivation && (
                      <p className="text-sm text-stone-600 italic line-clamp-2">
                        "{req.motivation.length > 80 ? req.motivation.slice(0, 80) + "…" : req.motivation}"
                      </p>
                    )}
                    {req.adminNote && (
                      <p className="pt-1 text-xs text-stone-500">
                        <span className="font-medium">Nota:</span> {req.adminNote}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[req.status] ?? "border-stone-200 bg-stone-100 text-stone-600"}`}
                  >
                    {STATUS_LABEL[req.status] ?? req.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
