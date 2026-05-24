import { Bold, Italic, Link, Strikethrough, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toolbarButtonClass = (active) =>
  cn(
    "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
    active && "bg-rose-50 text-rose-800 hover:bg-rose-100 hover:text-rose-900"
  );

export default function InlineControls({ editor, state, onLinkClick }) {
  const controls = [
    {
      label: "Negrita",
      Icon: Bold,
      active: state.isBold,
      disabled: !state.canBold,
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Cursiva",
      Icon: Italic,
      active: state.isItalic,
      disabled: !state.canItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Tachado",
      Icon: Strikethrough,
      active: state.isStrike,
      disabled: !state.canStrike,
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Subrayado",
      Icon: Underline,
      active: state.isUnderline,
      disabled: !state.canUnderline,
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
  ];

  return (
    <div className="flex items-center gap-1 border-l border-stone-200 pl-2">
      {controls.map((control) => {
        const IconComponent = control.Icon;

        return (
          <Button
            key={control.label}
            type="button"
            variant="ghost"
            size="icon-sm"
            title={control.label}
            aria-label={control.label}
            aria-pressed={control.active}
            disabled={control.disabled}
            onClick={control.action}
            className={toolbarButtonClass(control.active)}
          >
            <IconComponent size={16} />
          </Button>
        );
      })}

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title={state.isLink ? "Editar enlace" : "Agregar enlace"}
        aria-label={state.isLink ? "Editar enlace" : "Agregar enlace"}
        aria-pressed={state.isLink}
        disabled={!state.canLink}
        onClick={onLinkClick}
        className={toolbarButtonClass(state.isLink)}
      >
        <Link size={16} />
      </Button>
    </div>
  );
}
