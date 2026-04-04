import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

export default function InlineControls({ editor, state, onLinkClick }) {
  const buttonClass = (isActive, canDo) =>
    `px-3 py-1 rounded text-sm border transition 
    ${isActive ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-700"} 
    ${!canDo ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-300"}`;

  return (
    <div className="control-group flex-col gap-2">
      {/**First row: Inline formatting + Lists/Quotes + Headings + History */}
      <div className="flex flex-wrap gap-4 p-2">
        {/**Inline Formatting */}
        <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!state.canBold}
            className={buttonClass(state.isBold, state.canBold)}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!state.canItalic}
            className={buttonClass(state.isItalic, state.canItalic)}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!state.canStrike}
            className={buttonClass(state.isStrike, state.canStrike)}
          >
            <Strikethrough size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!state.canUnderline}
            className={buttonClass(state.isUnderline, state.canUnderline)}
          >
            <Underline size={16} />
          </button>
          {/**Link Extension Button*/}
          <button
            type="button"
            onClick={onLinkClick}
            disabled={!state.canLink}
            className={buttonClass(state.isLink, state.canLink)}
            title={state.isLink ? "Remover Link" : "Agregar Link"}
          >
            🔗
          </button>
        </div>
      </div>
    </div>
  );
}
