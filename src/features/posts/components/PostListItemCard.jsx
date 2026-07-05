import { BookOpen, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import PostRowActions from "./PostRowActions";
import { getPostStatusConfig } from "@/features/posts/utils/postStatus";
import { focalToObjectPosition } from "@/utils/imageUtils";

const truncate = (str, max = 90) =>
  str && str.length > max ? str.slice(0, max) + "…" : (str ?? "");

export default function PostListItemCard({
  postId,
  onDelete,
  onToggleStatus,
  imageUrl,
  focalX,
  focalY,
  author,
  title,
  status,
  categoryName,
  moderationNote,
  rejectionCount,
  canBeResubmitted,
  isLastAttempt,
}) {
  const navigate = useNavigate();

  const resolvedImage = imageUrl;

  const badge = getPostStatusConfig(status);

  return (
    <Card className="group flex w-full max-w-5xl flex-col gap-0 rounded-md border-border p-3 shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition-colors hover:bg-surface-warm md:flex-row">
      <div className="w-full shrink-0 overflow-hidden rounded-md bg-muted md:w-52">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={title}
            style={{ objectPosition: focalToObjectPosition(focalX, focalY) }}
            className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-video flex h-full w-full items-center justify-center text-muted-foreground">
            <BookOpen size={28} strokeWidth={1.4} aria-hidden="true" />
          </div>
        )}
      </div>

      <CardContent
        className="flex flex-1 cursor-pointer flex-col gap-3 p-4"
        onClick={() => navigate(`/user/edit-post/${postId}`)}
        title="Clic para editar"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-400">
            {categoryName ?? "Sin categoria"}
          </p>

          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.badgeClass}`}
          >
            {badge.label}
          </span>

          {status === "REJECTED" && (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400">
              Rechazado ({rejectionCount ?? 0}/3)
            </span>
          )}
        </div>

        <CardTitle className="line-clamp-2 font-serif text-2xl font-normal leading-tight text-foreground transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400">
          {title}
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground">
          Por {author ?? "Autor"}
        </CardDescription>

        {status === "REJECTED" && moderationNote && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Motivo: </span>
            {truncate(moderationNote)}
          </p>
        )}

        {status === "REJECTED" && isLastAttempt && canBeResubmitted && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle size={14} />
            Última oportunidad: si se rechaza de nuevo, el post se archivará permanentemente.
          </p>
        )}

        {status === "ARCHIVED" && moderationNote && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Motivo del archivo: </span>
            {truncate(moderationNote)}
          </p>
        )}
      </CardContent>

      <div className="flex items-start px-2 py-3">
        <PostRowActions
          status={status}
          canBeResubmitted={canBeResubmitted}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </Card>
  );
}
