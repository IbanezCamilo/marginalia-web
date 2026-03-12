import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlOptions } from "react-icons/sl";
import { MdDeleteForever } from "react-icons/md";

export default function PostRowActions({ postId, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Avoid triggering parent click events
    console.log("Delete action triggered");
    if (window.confirm("¿Estás seguro de que deseas eliminar este post?")) {
      onDelete(postId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <SlOptions size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-0 w-fit p-1">
        <DropdownMenuItem
          variant="destructive"
          className="flex items-center justify-between cursor-pointer"
          onClick={handleDelete}
        >
          <MdDeleteForever size={16} />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
