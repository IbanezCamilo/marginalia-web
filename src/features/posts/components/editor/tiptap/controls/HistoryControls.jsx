import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryControls({ editor, state }) {
  return (
    <div className="ml-auto flex items-center gap-1 border-l border-gray-200 pl-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Deshacer"
        aria-label="Deshacer"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        className="text-gray-600 hover:bg-stone-100 hover:text-stone-950"
      >
        <Undo2 size={16} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Rehacer"
        aria-label="Rehacer"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        className="text-gray-600 hover:bg-stone-100 hover:text-stone-950"
      >
        <Redo2 size={16} />
      </Button>
    </div>
  );
}
