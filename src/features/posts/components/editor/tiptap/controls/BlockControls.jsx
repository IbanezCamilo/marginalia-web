import AlignControls from "./AlignControls";
export default function BlockControls({ editor, state }) {
  const buttonClass = (isActive, canDo) =>
    `px-3 py-1 rounded text-sm border transition 
    ${isActive ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-700"} 
    ${!canDo ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-300"}`;

  return (
    <div className="control-group flex gap-2">
      {/**Lists and quotes */}
      <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!state.canBulletList}
          className={buttonClass(state.isBulletList, state.canBulletList)}
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!state.canOrderedList}
          className={buttonClass(state.isOrderedList, state.canOrderedList)}
        >
          1. Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!state.canBlockquote}
          className={buttonClass(state.isBlockquote, state.canBlockquote)}
        >
          " Cita
        </button>
      </div>

      {/**Headings */}
      <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(state.isHeading1, true)}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(state.isHeading2, true)}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={buttonClass(state.isHeading3, true)}
        >
          H3
        </button>
      </div>
    </div>
  );
}
