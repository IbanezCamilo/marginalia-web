import { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
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
  imageUrl,
  author,
  title,
  meta,
}) {
  console.log("imageUrl recibido:", imageUrl);
  const resolvedImage = imageUrl
    ? `http://localhost:8080/api/images/${imageUrl}`
    : "https://placehold.co/400x300?text=Sin+imagen";
  return (
    <Card className="group flex flex-col md:flex-row p-4 gap-x-2 w-full max-w-4xl min-h-[140px] rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/**Card Image*/}
      <div className="w-full md:w-52 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={resolvedImage}
          alt=""
          className="w-full h-full object-cover aspect-video"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/**Metadata */}
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {meta}
        </p>

        {/**Title */}
        <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2">
          {title}
        </CardTitle>

        {/**Author */}
        <CardDescription>
          by <Link to="">{author}</Link>
        </CardDescription>
      </CardContent>
      {/**Action buttons */}
      <div className="px-2 md:px-2 flex items-start">
        <PostRowActions postId={postId} onDelete={onDelete} />
      </div>
    </Card>
  );
}
