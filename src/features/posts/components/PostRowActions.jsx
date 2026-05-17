import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";

export default function PostRowActions({ onDelete, onToggleStatus, status }) {
  const isPublished = status === "PUBLISHED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-950"
        >
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 rounded-md border-stone-200 p-1">
        {isPublished ? (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-stone-700"
            onClick={onToggleStatus}
          >
            <EyeOff size={16} />
            Pasar a borrador
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-stone-700 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
            onClick={onToggleStatus}
          >
            <Eye size={16} />
            Publicar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          className="flex cursor-pointer items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
