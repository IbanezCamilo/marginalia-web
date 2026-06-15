import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";
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
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { getPostStatusConfig } from "@/features/posts/utils/postStatus";
import { usePostModeration } from "@/features/moderation/hooks/usePostModeration";
import PostModerationRowActions from "@/features/moderation/components/PostModerationRowActions";

const FILTER_TABS = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "REJECTED", label: "Rechazado" },
  { value: "ARCHIVED", label: "Archivado", adminOnly: true },
];

const MODERATION_COPY = {
  approve: {
    title: "Aprobar publicación",
    description: "El post será publicado y visible para todos los lectores.",
    confirmLabel: "Aprobar",
    confirmClass: "bg-emerald-700 hover:bg-emerald-800 text-white",
    noteRequired: false,
  },
  reject: {
    title: "Rechazar publicación",
    description:
      "Indica el motivo del rechazo. El autor verá esta nota y podrá editar el post antes de reenviarlo.",
    confirmLabel: "Rechazar",
    confirmClass: "bg-rose-700 hover:bg-rose-800 text-white",
    noteRequired: true,
  },
  archive: {
    title: "Archivar publicación",
    description:
      "El post dejará de estar visible. Solo un administrador podrá restablecerlo más adelante.",
    confirmLabel: "Archivar",
    confirmClass: "bg-stone-800 hover:bg-stone-900 text-white",
    noteRequired: false,
  },
  toDraft: {
    title: "Volver a borrador",
    description:
      "El post volverá a estado borrador para que el autor pueda editarlo y reenviarlo para revisión.",
    confirmLabel: "Volver a borrador",
    confirmClass: "bg-stone-800 hover:bg-stone-900 text-white",
    noteRequired: false,
  },
};

const formatDate = (dateStr) =>
  dateStr
    ? new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(dateStr),
      )
    : "—";

const truncate = (str, max = 60) =>
  str && str.length > max ? str.slice(0, max) + "…" : (str ?? "—");

export default function PostModeration() {
  const {
    posts,
    totalElements,
    totalPages,
    currentPage,
    statusFilter,
    loading,
    error,
    isAdmin,
    resolving,
    load,
    changeFilter,
    moderationState,
    setModerationState,
    openModeration,
    closeModeration,
    confirmModeration,
    resetState,
    setResetState,
    openReset,
    closeReset,
    confirmReset,
    confirmDeleteState,
    requestDelete,
    closeDelete,
    confirmDelete,
  } = usePostModeration();

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
        <ShieldCheck size={40} strokeWidth={1.5} className="text-rose-700" />
        <h1 className="mt-5 font-serif text-4xl text-stone-950">
          No pudimos cargar los posts
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

  const moderationCopy = moderationState.type ? MODERATION_COPY[moderationState.type] : null;

  return (
    <div className="mx-auto max-w-6xl">

      {/* Moderation dialog (approve / reject / archive / toDraft) */}
      <Dialog open={moderationState.open} onOpenChange={(open) => !open && closeModeration()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-stone-950">
              {moderationCopy?.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-500">{moderationCopy?.description}</p>
          <div className="space-y-1.5">
            <Label
              htmlFor="moderationNote"
              className="text-xs uppercase tracking-wide text-stone-500"
            >
              Nota{" "}
              {moderationCopy?.noteRequired ? (
                <span className="normal-case tracking-normal text-rose-600">(obligatoria)</span>
              ) : (
                <span className="normal-case tracking-normal text-stone-400">(opcional)</span>
              )}
            </Label>
            <Textarea
              id="moderationNote"
              placeholder="Escribe un comentario para el autor…"
              value={moderationState.moderationNote}
              onChange={(e) =>
                setModerationState((prev) => ({ ...prev, moderationNote: e.target.value }))
              }
              maxLength={300}
              rows={3}
              className="resize-none border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-stone-400">
              {moderationState.moderationNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeModeration}
              disabled={resolving}
              className="border-stone-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmModeration}
              disabled={resolving}
              className={moderationCopy?.confirmClass}
            >
              {resolving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Procesando…
                </>
              ) : (
                moderationCopy?.confirmLabel
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset dialog (admin only) */}
      <Dialog open={resetState.open} onOpenChange={(open) => !open && closeReset()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-stone-950">
              Restablecer post
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-500">
            El post volverá a estado borrador y su contador de rechazos se reiniciará a 0.
          </p>
          <div className="space-y-1.5">
            <Label
              htmlFor="resetNote"
              className="text-xs uppercase tracking-wide text-stone-500"
            >
              Nota{" "}
              <span className="normal-case tracking-normal text-stone-400">(opcional)</span>
            </Label>
            <Textarea
              id="resetNote"
              placeholder="Escribe un comentario para el autor…"
              value={resetState.moderationNote}
              onChange={(e) =>
                setResetState((prev) => ({ ...prev, moderationNote: e.target.value }))
              }
              maxLength={300}
              rows={3}
              className="resize-none border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-stone-400">
              {resetState.moderationNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeReset}
              disabled={resolving}
              className="border-stone-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmReset}
              disabled={resolving}
              className="bg-stone-800 hover:bg-stone-900 text-white"
            >
              {resolving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Procesando…
                </>
              ) : (
                "Restablecer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation (admin only) */}
      <ConfirmDialog
        open={confirmDeleteState.open}
        onOpenChange={(open) => !open && closeDelete()}
        title="¿Eliminar este post permanentemente?"
        description="Esta acción eliminará el post y su imagen de portada de forma irreversible. No podrá recuperarse."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      {/* Header */}
      <div className="mb-6 rounded-md border border-stone-200 bg-[#fbf8f3] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
              Moderación
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-950">
              Revisión de posts
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-500">
                {totalElements}
              </span>
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Aprueba, rechaza o archiva publicaciones de la plataforma.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.filter((tab) => !tab.adminOnly || isAdmin).map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                onClick={() => changeFilter(tab.value)}
                className={
                  statusFilter === tab.value
                    ? "bg-stone-950 text-white hover:bg-stone-800"
                    : "border border-stone-300 bg-transparent text-stone-700 hover:bg-stone-100"
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {posts.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
          <ShieldCheck size={42} strokeWidth={1.5} className="text-stone-400" />
          <h2 className="mt-5 font-serif text-3xl text-stone-950">
            No hay posts en esta categoría
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
            Cuando haya publicaciones con este estado, aparecerán aquí para su revisión.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
            <Table className="w-full">
              <TableHeader className="border-b border-stone-200 bg-stone-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Título
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Autor
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 lg:table-cell">
                    Categoría
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 md:table-cell">
                    Moderado por
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 sm:table-cell">
                    Creado
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-stone-200">
                {posts.map((post) => {
                  const badge = getPostStatusConfig(post.status);
                  return (
                    <TableRow key={post.id} className="transition-colors hover:bg-[#fbf8f3]">
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-stone-950">{truncate(post.title, 50)}</div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.badgeClass}`}
                          >
                            {badge.label}
                          </span>
                          {post.isPermanentlyBlocked && (
                            <span className="rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                              Bloqueado
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-stone-600">
                        <div className="font-medium text-stone-950">{post.authorName}</div>
                        {isAdmin && post.authorEmail && (
                          <div className="text-xs text-stone-500">{post.authorEmail}</div>
                        )}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-stone-500 lg:table-cell">
                        {post.categoryName ?? "—"}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-stone-500 md:table-cell">
                        {post.moderatedByName ? (
                          <>
                            <div>{post.moderatedByName}</div>
                            <div className="text-xs text-stone-400">{formatDate(post.moderatedAt)}</div>
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-stone-500 sm:table-cell">
                        {formatDate(post.createdAt)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <PostModerationRowActions
                          status={post.status}
                          isPermanentlyBlocked={post.isPermanentlyBlocked}
                          isAdmin={isAdmin}
                          onModerate={(type) => openModeration(type, post.id)}
                          onReset={() => openReset(post.id)}
                          onDelete={() => requestDelete(post.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
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
