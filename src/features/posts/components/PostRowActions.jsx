import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";

export default function PostRowActions({ onDelete, onToggleStatus, status, canBeResubmitted }) {
  const isPublished = status === "PUBLISHED";
  const isRejected = status === "REJECTED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 rounded-md border-border p-1">
        {isPublished && (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground"
            onClick={onToggleStatus}
          >
            <EyeOff size={16} />
            Pasar a borrador
          </DropdownMenuItem>
        )}
        {status === "DRAFT" && (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700 dark:data-[highlighted]:bg-emerald-950 dark:data-[highlighted]:text-emerald-400"
            onClick={onToggleStatus}
          >
            <Eye size={16} />
            Publicar
          </DropdownMenuItem>
        )}
        {isRejected && canBeResubmitted && (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground"
            onClick={onToggleStatus}
          >
            <RotateCcw size={16} />
            Volver a borrador
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
