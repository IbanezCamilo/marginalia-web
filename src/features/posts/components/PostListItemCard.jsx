import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import PostRowActions from "./PostRowActions";

export default function PostListItemCard({
  postId,
  onDelete,
  onToggleStatus,
  imageUrl,
  author,
  title,
  status,
  categoryName,
}) {
  const navigate = useNavigate();

  const resolvedImage = imageUrl;

  const statusConfig = {
    PUBLISHED: {
      label: "Publicado",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    DRAFT: {
      label: "Borrador",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
  };

  const badge = statusConfig[status] ?? {
    label: status,
    className: "border-stone-200 bg-stone-100 text-stone-600",
  };

  return (
    <Card className="group flex w-full max-w-5xl flex-col gap-0 rounded-md border-stone-200 p-3 shadow-[0_1px_2px_rgba(28,25,23,0.04)] transition-colors hover:bg-surface-warm md:flex-row">
      <div className="w-full shrink-0 overflow-hidden rounded-md bg-stone-100 md:w-52">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={title}
            className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-video flex h-full w-full items-center justify-center text-stone-300">
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
            {categoryName ?? "Sin categoria"}
          </p>

          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        <CardTitle className="line-clamp-2 font-serif text-2xl font-normal leading-tight text-stone-950 transition-colors group-hover:text-rose-800">
          {title}
        </CardTitle>

        <CardDescription className="text-sm text-stone-500">
          Por {author ?? "Autor"}
        </CardDescription>
      </CardContent>

      <div className="flex items-start px-2 py-3">
        <PostRowActions
          status={status}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </Card>
  );
}
