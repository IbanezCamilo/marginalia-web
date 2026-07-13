import { Loader2, ShieldCheck } from "lucide-react";
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
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
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
    confirmClass: "bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-700 dark:hover:bg-stone-600",
    noteRequired: false,
  },
  toDraft: {
    title: "Volver a borrador",
    description:
      "El post volverá a estado borrador para que el autor pueda editarlo y reenviarlo para revisión.",
    confirmLabel: "Volver a borrador",
    confirmClass: "bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-700 dark:hover:bg-stone-600",
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
    confirmDeletePostTitle,
    requestDelete,
    closeDelete,
    confirmDelete,
  } = usePostModeration();

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-80 animate-pulse rounded-md border border-border bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={ShieldCheck}
        title="No pudimos cargar los posts"
        message={error}
        onRetry={() => load(0, statusFilter)}
      />
    );
  }

  const moderationCopy = moderationState.type ? MODERATION_COPY[moderationState.type] : null;

  return (
    <div className="mx-auto max-w-6xl">

      {/* Moderation dialog (approve / reject / archive / toDraft) */}
      <Dialog open={moderationState.open} onOpenChange={(open) => !open && closeModeration()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              {moderationCopy?.title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{moderationCopy?.description}</p>
          <div className="space-y-1.5">
            <Label
              htmlFor="moderationNote"
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Nota{" "}
              {moderationCopy?.noteRequired ? (
                <span className="normal-case tracking-normal text-rose-600 dark:text-rose-400">(obligatoria)</span>
              ) : (
                <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
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
              className="resize-none border-border bg-muted text-foreground placeholder:text-muted-foreground
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-muted-foreground">
              {moderationState.moderationNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeModeration}
              disabled={resolving}
              className="border-border"
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
            <DialogTitle className="font-serif text-2xl text-foreground">
              Restablecer post
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            El post volverá a estado borrador y su contador de rechazos se reiniciará a 0.
          </p>
          <div className="space-y-1.5">
            <Label
              htmlFor="resetNote"
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Nota{" "}
              <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
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
              className="resize-none border-border bg-muted text-foreground placeholder:text-muted-foreground
                         focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
            />
            <p className="text-right text-xs text-muted-foreground">
              {resetState.moderationNote.length}/300
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeReset}
              disabled={resolving}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmReset}
              disabled={resolving}
              className="bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-700 dark:hover:bg-stone-600"
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
        description={
          confirmDeletePostTitle
            ? `Esta acción eliminará "${confirmDeletePostTitle}" y su imagen de portada de forma irreversible. No podrá recuperarse.`
            : "Esta acción eliminará el post y su imagen de portada de forma irreversible. No podrá recuperarse."
        }
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Moderación
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Revisión de posts
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {totalElements}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Aprueba, rechaza o archiva publicaciones de la plataforma.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.filter((tab) => !tab.adminOnly || isAdmin).map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                onClick={() => changeFilter(tab.value)}
                className={
                  statusFilter === tab.value
                    ? "bg-stone-950 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300"
                    : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No hay posts en esta categoría"
          description="Cuando haya publicaciones con este estado, aparecerán aquí para su revisión."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
            <Table className="w-full">
              <TableHeader className="border-b border-border bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Título
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Autor
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:table-cell">
                    Categoría
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:table-cell">
                    Moderado por
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:table-cell">
                    Nota
                  </TableHead>
                  <TableHead className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:table-cell">
                    Creado
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {posts.map((post) => {
                  const badge = getPostStatusConfig(post.status);
                  return (
                    <TableRow key={post.id} className="transition-colors hover:bg-surface-warm">
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-foreground">{truncate(post.title, 50)}</div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.badgeClass}`}
                          >
                            {badge.label}
                          </span>
                          {post.isPermanentlyBlocked && (
                            <span className="rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
                              Bloqueado
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">{post.authorName}</div>
                        {isAdmin && post.authorEmail && (
                          <div className="text-xs text-muted-foreground">{post.authorEmail}</div>
                        )}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground lg:table-cell">
                        {post.categoryName ?? "—"}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground md:table-cell">
                        {post.moderatedByName ? (
                          <>
                            <div>{post.moderatedByName}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(post.moderatedAt)}</div>
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="hidden max-w-xs px-6 py-4 text-sm text-muted-foreground md:table-cell">
                        {post.moderationNote ? (
                          <span className="block whitespace-pre-line break-words">{post.moderationNote}</span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">
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
