import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function UserRowActions({ onEdit, onDelete, disableDelete }) {
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
      <DropdownMenuContent className="w-40 rounded-md border-stone-200 p-1">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-stone-700"
          onClick={onEdit}
        >
          <Pencil size={16} />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="flex cursor-pointer items-center gap-2"
          onClick={onDelete}
          disabled={disableDelete}
        >
          <Trash2 size={16} />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
