import { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const resolvedImage = imageUrl
    ? `http://localhost:8080/api/images/${imageUrl}`
    : "https://placehold.co/400x300?text=Sin+imagen";

  /**
   * Visual configuration of the status badge.
   *
   * Lesson: centralizing visual configuration in an object
   * is cleaner than repeating conditional classes in the JSX.
   */
  const statusConfig = {
    PUBLISHED: {
      label: "Publicado",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
    DRAFT: {
      label: "Borrador",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
    },
  };

  // Fallback in case an unknown status arrives (e.g.: ARCHIVED, REJECTED)
  const badge = statusConfig[status] ?? {
    label: status,
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  };

  return (
    <Card className="group flex flex-col md:flex-row p-4 gap-x-2 w-full max-w-4xl min-h-[140px] rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="w-full md:w-52 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={resolvedImage}
          alt={title}
          className="w-full h-full object-cover aspect-video"
        />
      </div>

      {/* Content — clickable to go to the editor */}
      <CardContent
        className="flex flex-1 flex-col gap-3 p-5 cursor-pointer"
        onClick={() => navigate(`/user/edit-post/${postId}`)}
        title="Clic para editar"
      >
        {/* Category + Status Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {categoryName}
          </p>

          {/*Visual status badge with semantic colors */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Title */}
        <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2 group-hover:text-rose-600 transition-colors">
          {title}
        </CardTitle>

        {/* Author */}
        <CardDescription>by {author}</CardDescription>
      </CardContent>

      {/* Actions */}
      <div className="px-2 md:px-2 flex items-start">
        <PostRowActions
          status={status}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </Card>
  );
}
