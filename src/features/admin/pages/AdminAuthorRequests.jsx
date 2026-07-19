import { useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuthorRequests } from "@/features/admin/hooks/useAdminAuthorRequests";
import { useAuth } from "@/features/auth/hooks/useAuth";

const CLAIM_BADGE =
  "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400";

const STATUS_BADGE = {
  PENDING:  "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400",
};

const STATUS_LABEL = {
  PENDING:  "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

const SKELETON_COLUMNS = [
  { label: "Solicitante", barClass: "h-4 w-28" },
  { label: "Email", barClass: "h-4 w-40" },
  { label: "Motivación", responsive: "hidden lg:table-cell", barClass: "h-4 w-32" },
  { label: "Estado", barClass: "h-6 w-16 rounded-full" },
  { label: "Nota", responsive: "hidden lg:table-cell", barClass: "h-4 w-24" },
  { label: "Fecha", responsive: "hidden sm:table-cell", barClass: "h-4 w-20" },
  { label: "Acciones", barClass: "h-7 w-24" },
];

const formatDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(dateStr),
      )
    : "—";

const truncate = (str, max = 60) =>
  str && str.length > max ? str.slice(0, max) + "…" : (str ?? "—");

export default function AdminAuthorRequests() {
  const { state: { user: currentUser } } = useAuth();
  const [detailRequest, setDetailRequest] = useState(null);
  const {
    requests,
    totalElements,
    totalPages,
    currentPage,
    statusFilter,
    loading,
    error,
    resolveState,
    resolving,
    load,
    changeFilter,
    openResolve,
    closeResolve,
    confirmResolve,
    setResolveState,
  } = useAdminAuthorRequests();
  const resolveRequest = requests.find((r) => r.id === resolveState.requestId);

  if (error) {
    return (
      <PageError
        icon={ClipboardList}
        title="No pudimos cargar las solicitudes"
        message={error}
        onRetry={() => load(0, statusFilter)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      <Dialog open={resolveState.open} onOpenChange={(open) => !open && closeResolve()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              {resolveState.type === "approve" ? "Aprobar solicitud" : "Rechazar solicitud"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {resolveState.type === "approve"
              ? "El usuario recibirá el rol de Autor. Puedes añadir una nota opcional."
              : "La solicitud será rechazada. Puedes indicar el motivo de forma opcional."}
          </p>
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Motivación del solicitante
            </p>
            {resolveRequest?.motivation ? (
              <p className="max-h-40 overflow-y-auto whitespace-pre-line break-words rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
                {resolveRequest.motivation}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">Sin motivación.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="adminNote"
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Nota para el usuario{" "}
              <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="adminNote"
              placeholder="Escribe un mensaje para el solicitante…"
              value={resolveState.adminNote}
              onChange={(e) =>
                setResolveState((prev) => ({ ...prev, adminNote: e.target.value }))
              }
              maxLength={300}
              rows={3}
              className="resize-none border-border bg-muted text-foreground placeholder:text-muted-foreground
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-muted-foreground">
              {resolveState.adminNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeResolve}
              disabled={resolving}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmResolve}
              disabled={resolving}
              className={
                resolveState.type === "approve"
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                  : "bg-rose-700 hover:bg-rose-800 text-white"
              }
            >
              {resolving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Procesando…
                </>
              ) : resolveState.type === "approve" ? (
                "Aprobar"
              ) : (
                "Rechazar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailRequest != null} onOpenChange={(open) => !open && setDetailRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              {detailRequest?.requesterName}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Solicitud enviada el {formatDate(detailRequest?.createdAt)}.
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Motivación</p>
              {detailRequest?.motivation ? (
                <p className="max-h-40 overflow-y-auto whitespace-pre-line break-words rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
                  {detailRequest.motivation}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">—</p>
              )}
            </div>
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Nota</p>
              {detailRequest?.adminNote ? (
                <p className="max-h-40 overflow-y-auto whitespace-pre-line break-words rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground">
                  {detailRequest.adminNote}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">—</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Gestión
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Solicitudes de autoría
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {loading ? <Skeleton className="h-4 w-5 rounded-full" /> : totalElements}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa y resuelve las solicitudes de acceso de autor.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => changeFilter("PENDING")}
              className={
                statusFilter === "PENDING"
                  ? "bg-stone-950 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300"
                  : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
              }
            >
              Pendientes
            </Button>
            <Button
              size="sm"
              onClick={() => changeFilter(null)}
              className={
                statusFilter === null
                  ? "bg-stone-950 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300"
                  : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
              }
            >
              Todas
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={SKELETON_COLUMNS} rows={6} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={statusFilter === "PENDING" ? "No hay solicitudes pendientes" : "No hay solicitudes"}
          description={
            statusFilter === "PENDING"
              ? "Todas las solicitudes han sido procesadas."
              : "Aún no se han enviado solicitudes de autoría."
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
            <Table className="w-full">
              <TableHeader className="border-b border-border bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Solicitante
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:table-cell">
                    Motivación
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Estado
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:table-cell">
                    Nota
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:table-cell">
                    Fecha
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {requests.map((req) => {
                  // Claim fields are only non-null while the claim is active
                  // (the backend nulls expired claims in the response).
                  const claimedByOther =
                    req.claimedById != null && req.claimedById !== currentUser?.id;
                  return (
                  <TableRow
                    key={req.id}
                    className="transition-colors hover:bg-surface-warm"
                  >
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      {req.requesterName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {req.requesterEmail}
                    </TableCell>
                    <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground lg:table-cell">
                      {req.motivation ? (
                        <button
                          type="button"
                          onClick={() => setDetailRequest(req)}
                          title="Ver texto completo"
                          className="cursor-pointer text-left underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
                        >
                          {truncate(req.motivation)}
                        </button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[req.status] ?? "border-border bg-muted text-muted-foreground"}`}
                      >
                        {STATUS_LABEL[req.status] ?? req.status}
                      </span>
                      {req.status === "PENDING" && req.claimedByName && (
                        <span
                          className={`mt-1.5 block w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${CLAIM_BADGE}`}
                        >
                          {claimedByOther
                            ? `En revisión por ${req.claimedByName}`
                            : "En revisión por ti"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground lg:table-cell">
                      {req.adminNote ? (
                        <button
                          type="button"
                          onClick={() => setDetailRequest(req)}
                          title="Ver texto completo"
                          className="cursor-pointer text-left underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
                        >
                          {truncate(req.adminNote)}
                        </button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {req.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            disabled={claimedByOther}
                            title={claimedByOther ? `En revisión por ${req.claimedByName}` : undefined}
                            onClick={() => openResolve("approve", req.id)}
                            className="h-7 bg-emerald-700 px-3 text-xs hover:bg-emerald-800"
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={claimedByOther}
                            title={claimedByOther ? `En revisión por ${req.claimedByName}` : undefined}
                            onClick={() => openResolve("reject", req.id)}
                            className="h-7 border-rose-200 px-3 text-xs text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-300"
                          >
                            Rechazar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => load(currentPage - 1, statusFilter)}
                  className="border-border"
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => load(currentPage + 1, statusFilter)}
                  className="border-border"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
