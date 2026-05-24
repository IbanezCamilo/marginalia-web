import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AlignControls({ editor, state }) {
  if (!editor) return null;

  const alignments = [
    { label: "Izquierda", Icon: AlignLeft, value: "left", active: state.isLeft },
    { label: "Centro", Icon: AlignCenter, value: "center", active: state.isCenter },
    { label: "Derecha", Icon: AlignRight, value: "right", active: state.isRight },
    { label: "Justificado", Icon: AlignJustify, value: "justify", active: state.isJustify },
  ];

  const current = alignments.find((alignment) => alignment.active) ?? alignments[0];
  const CurrentIcon = current.Icon;

  return (
    <div className="border-l border-stone-200 pl-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Alineacion"
            aria-label="Alineacion"
            className="gap-1 text-stone-600 hover:bg-stone-100 hover:text-stone-950"
          >
            <CurrentIcon size={16} />
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {alignments.map((alignment) => {
            const IconComponent = alignment.Icon;

            return (
              <DropdownMenuItem
                key={alignment.value}
                onClick={() =>
                  editor.chain().focus().setTextAlign(alignment.value).run()
                }
              >
                <IconComponent size={16} />
                <span>{alignment.label}</span>
                {alignment.active && (
                  <Check size={14} className="ml-auto text-rose-700" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
