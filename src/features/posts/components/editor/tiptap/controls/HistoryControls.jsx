export default function HistoryControls({ editor, state }) {
  const buttonClass = (isActive, canDo) =>
    `px-3 py-1 rounded text-sm border transition 
    ${isActive ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-700"} 
    ${!canDo ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-300"}`;

  return (
    <div className="button-group flex gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        className={buttonClass(false, state.canUndo)}
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        className={buttonClass(false, state.canRedo)}
      >
        Redo
      </button>
    </div>
  );
}
