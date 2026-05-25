import { Check, ChevronDown, Heading1, Heading2, Heading3, List, ListOrdered, Pilcrow, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const toolbarButtonClass = (active) =>
  cn(
    "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
    active && "bg-rose-50 text-rose-800 hover:bg-rose-100 hover:text-rose-900"
  );

export default function BlockControls({ editor, state }) {
  const blockTypes = [
    {
      label: "Parrafo",
      Icon: Pilcrow,
      active: state.isParagraph,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "Titulo 1",
      Icon: Heading1,
      active: state.isHeading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Titulo 2",
      Icon: Heading2,
      active: state.isHeading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Titulo 3",
      Icon: Heading3,
      active: state.isHeading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  const CurrentIcon =
    blockTypes.find((block) => block.active)?.Icon ?? Pilcrow;

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 text-stone-700 hover:bg-stone-100"
          >
            <CurrentIcon size={16} />
            <span className="hidden text-xs font-medium sm:inline">
              {blockTypes.find((block) => block.active)?.label ?? "Parrafo"}
            </span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {blockTypes.map((block) => {
            const IconComponent = block.Icon;

            return (
              <DropdownMenuItem key={block.label} onClick={block.action}>
                <IconComponent size={16} />
                <span>{block.label}</span>
                {block.active && (
                  <Check size={14} className="ml-auto text-rose-700" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Lista con vinetas"
        aria-label="Lista con vinetas"
        aria-pressed={state.isBulletList}
        disabled={!state.canBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toolbarButtonClass(state.isBulletList)}
      >
        <List size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Lista numerada"
        aria-label="Lista numerada"
        aria-pressed={state.isOrderedList}
        disabled={!state.canOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toolbarButtonClass(state.isOrderedList)}
      >
        <ListOrdered size={16} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Cita"
        aria-label="Cita"
        aria-pressed={state.isBlockquote}
        disabled={!state.canBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={toolbarButtonClass(state.isBlockquote)}
      >
        <Quote size={16} />
      </Button>
    </div>
  );
}
