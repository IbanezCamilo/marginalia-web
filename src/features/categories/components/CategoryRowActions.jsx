import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

export default function CategoryRowActions({ onDelete }) {
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
      <DropdownMenuContent className="w-36 rounded-md border-border p-1">
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
