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
import { Eye, EyeOff } from "lucide-react";

export default function PostRowActions({ onDelete, onToggleStatus, status }) {
  const isPublished = status === "PUBLISHED";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <SlOptions size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-0 w-fit p-1">
        {isPublished ? (
          <DropdownMenuItem
            className="flex items-center justify-stretch gap-2 cursor-pointer"
            onClick={onToggleStatus}
          >
            <EyeOff size={16} />
            Pasar a borrador
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="group flex items-center justify-stretch gap-2 cursor-pointer
            text-gray-700
            hover:bg-green-100 hover:text-green-700
            focus:bg-green-100 focus:text-green-700
            data-[highlighted]:bg-green-100 data-[highlighted]:text-green-700
            "
            onClick={onToggleStatus}
          >
            <Eye
              size={16}
              className="group-hover:text-green-700 group-focus:text-green-700"
            />
            Publicar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          className="flex items-center justify-stretch cursor-pointer"
          onClick={onDelete}
        >
          <MdDeleteForever size={16} />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
