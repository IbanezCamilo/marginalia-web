import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Archive,
  Check,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

export default function PostModerationRowActions({
  status,
  isPermanentlyBlocked,
  isAdmin,
  onModerate,
  onReset,
  onDelete,
}) {
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
      <DropdownMenuContent className="w-48 rounded-md border-border p-1">
        {status === "DRAFT" && (
          <>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700 dark:data-[highlighted]:bg-emerald-950 dark:data-[highlighted]:text-emerald-400"
              onClick={() => onModerate("approve")}
            >
              <Check size={16} />
              Aprobar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700 dark:data-[highlighted]:bg-rose-950 dark:data-[highlighted]:text-rose-400"
              onClick={() => onModerate("reject")}
            >
              <X size={16} />
              Rechazar
            </DropdownMenuItem>
          </>
        )}

        {status === "PUBLISHED" && (
          <>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-700 dark:data-[highlighted]:bg-rose-950 dark:data-[highlighted]:text-rose-400"
              onClick={() => onModerate("reject")}
            >
              <X size={16} />
              Rechazar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground"
              onClick={() => onModerate("archive")}
            >
              <Archive size={16} />
              Archivar
            </DropdownMenuItem>
          </>
        )}

        {status === "REJECTED" && (
          <>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700 dark:data-[highlighted]:bg-emerald-950 dark:data-[highlighted]:text-emerald-400"
              onClick={() => onModerate("approve")}
            >
              <Check size={16} />
              Aprobar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-foreground"
              onClick={() => onModerate("toDraft")}
            >
              <RotateCcw size={16} />
              Volver a borrador
            </DropdownMenuItem>
          </>
        )}

        {status === "ARCHIVED" && isAdmin && isPermanentlyBlocked && (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-foreground"
            onClick={onReset}
          >
            <RefreshCw size={16} />
            Restablecer
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            variant="destructive"
            className="flex cursor-pointer items-center gap-2"
            onClick={onDelete}
          >
            <Trash2 size={16} />
            Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
