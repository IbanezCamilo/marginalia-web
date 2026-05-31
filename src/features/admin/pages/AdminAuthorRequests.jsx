import { ClipboardList, Loader2, RefreshCw } from "lucide-react";
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
import { useAdminAuthorRequests } from "@/features/admin/hooks/useAdminAuthorRequests";

const STATUS_BADGE = {
  PENDING:  "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

const STATUS_LABEL = {
  PENDING:  "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

const formatDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(dateStr),
      )
    : "—";

const truncate = (str, max = 60) =>
  str && str.length > max ? str.slice(0, max) + "…" : (str ?? "—");

export default function AdminAuthorRequests() {
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

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-80 animate-pulse rounded-md border border-stone-200 bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center text-center">
        <ClipboardList size={40} strokeWidth={1.5} className="text-rose-700" />
        <h1 className="mt-5 font-serif text-4xl text-stone-950">
          No pudimos cargar las solicitudes
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{error}</p>
        <Button
          onClick={() => load(0, statusFilter)}
          className="mt-6 bg-rose-700 hover:bg-rose-800"
        >
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Resolve dialog */}
      <Dialog open={resolveState.open} onOpenChange={(open) => !open && closeResolve()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-stone-950">
              {resolveState.type === "approve" ? "Aprobar solicitud" : "Rechazar solicitud"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-500">
            {resolveState.type === "approve"
              ? "El usuario recibirá el rol de Autor. Puedes añadir una nota opcional."
              : "La solicitud será rechazada. Puedes indicar el motivo de forma opcional."}
          </p>
          <div className="space-y-1.5">
            <Label
              htmlFor="adminNote"
              className="text-xs uppercase tracking-wide text-stone-500"
            >
              Nota para el usuario{" "}
              <span className="normal-case tracking-normal text-stone-400">(opcional)</span>
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
              className="resize-none border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-stone-400">
              {resolveState.adminNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeResolve}
              disabled={resolving}
              className="border-stone-300"
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

      {/* Header */}
      <div className="mb-6 rounded-md border border-stone-200 bg-[#fbf8f3] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
              Gestión
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-950">
              Solicitudes de autoría
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-500">
                {totalElements}
              </span>
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Revisa y resuelve las solicitudes de acceso de autor.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => changeFilter("PENDING")}
              className={
                statusFilter === "PENDING"
                  ? "bg-stone-950 text-white hover:bg-stone-800"
                  : "border border-stone-300 bg-transparent text-stone-700 hover:bg-stone-100"
              }
            >
              Pendientes
            </Button>
            <Button
              size="sm"
              onClick={() => changeFilter(null)}
              className={
                statusFilter === null
                  ? "bg-stone-950 text-white hover:bg-stone-800"
                  : "border border-stone-300 bg-transparent text-stone-700 hover:bg-stone-100"
              }
            >
              Todas
            </Button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {requests.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
          <ClipboardList size={42} strokeWidth={1.5} className="text-stone-400" />
          <h2 className="mt-5 font-serif text-3xl text-stone-950">
            {statusFilter === "PENDING" ? "No hay solicitudes pendientes" : "No hay solicitudes"}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
            {statusFilter === "PENDING"
              ? "Todas las solicitudes han sido procesadas."
              : "Aún no se han enviado solicitudes de autoría."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
            <Table className="w-full">
              <TableHeader className="border-b border-stone-200 bg-stone-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Solicitante
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Email
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 lg:table-cell">
                    Motivación
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Estado
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 sm:table-cell">
                    Fecha
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-stone-200">
                {requests.map((req) => (
                  <TableRow
                    key={req.id}
                    className="transition-colors hover:bg-[#fbf8f3]"
                  >
                    <TableCell className="px-6 py-4 font-medium text-stone-950">
                      {req.requesterName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-stone-600">
                      {req.requesterEmail}
                    </TableCell>
                    <TableCell className="hidden px-6 py-4 text-sm text-stone-500 lg:table-cell">
                      {truncate(req.motivation)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[req.status] ?? "border-stone-200 bg-stone-100 text-stone-600"}`}
                      >
                        {STATUS_LABEL[req.status] ?? req.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden px-6 py-4 text-sm text-stone-500 sm:table-cell">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {req.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => openResolve("approve", req.id)}
                            className="h-7 bg-emerald-700 px-3 text-xs hover:bg-emerald-800"
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResolve("reject", req.id)}
                            className="h-7 border-rose-200 px-3 text-xs text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                          >
                            Rechazar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-stone-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => load(currentPage - 1, statusFilter)}
                  className="border-stone-300"
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => load(currentPage + 1, statusFilter)}
                  className="border-stone-300"
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
