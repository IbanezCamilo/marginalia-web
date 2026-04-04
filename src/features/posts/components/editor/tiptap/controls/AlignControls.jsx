import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AlignControls({ editor }) {
  if (!editor) return null;

  const alignments = [
    { label: "Alinear a la izquierda", Icon: AlignLeft, value: "left" },
    { label: "Centrar", Icon: AlignCenter, value: "center" },
    { label: "Alinear a la derecha", Icon: AlignRight, value: "right" },
    { label: "Justificar", Icon: AlignJustify, value: "justify" },
  ];

  const current =
    alignments.find((a) => editor.isActive({ textAlign: a.value })) ||
    alignments[0];

  const CurrentIcon = current.Icon;

  return (
    <div className="pr-4 border-r border-gray-300">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
          <CurrentIcon size={16} />
          <ChevronDown size={14} />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {alignments.map(({ label, Icon, value }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => editor.chain().focus().setTextAlign(value).run()}
              className={`flex items-center gap-2 ${editor.isActive({ textAlign: value }) ? "bg-rose-100" : ""}`}
            >
              <Icon size={16} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
