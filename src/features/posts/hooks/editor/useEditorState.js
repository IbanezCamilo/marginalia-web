import { useEffect, useRef, useState } from "react";

const getEditorState = (editor) => {
  const { from, to } = editor.state.selection;
  const hasSelection = from !== to;

  return {
    isBold: editor.isActive("bold"),
    canBold: editor.can().chain().focus().toggleBold().run(),
    isItalic: editor.isActive("italic"),
    canItalic: editor.can().chain().focus().toggleItalic().run(),
    isStrike: editor.isActive("strike"),
    canStrike: editor.can().chain().focus().toggleStrike().run(),
    isUnderline: editor.isActive("underline"),
    canUnderline: editor.can().chain().focus().toggleUnderline().run(),
    isLink: editor.isActive("link"),
    canLink: hasSelection || editor.isActive("link"),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
    isBulletList: editor.isActive("bulletList"),
    canBulletList: editor.can().chain().focus().toggleBulletList().run(),
    isOrderedList: editor.isActive("orderedList"),
    canOrderedList: editor.can().chain().focus().toggleOrderedList().run(),
    isBlockquote: editor.isActive("blockquote"),
    canBlockquote: editor.can().chain().focus().toggleBlockquote().run(),
    isHeading1: editor.isActive("heading", { level: 1 }),
    isHeading2: editor.isActive("heading", { level: 2 }),
    isHeading3: editor.isActive("heading", { level: 3 }),
    isParagraph: editor.isActive("paragraph"),
    isLeft: editor.isActive({ textAlign: "left" }),
    isCenter: editor.isActive({ textAlign: "center" }),
    isRight: editor.isActive({ textAlign: "right" }),
    isJustify: editor.isActive({ textAlign: "justify" }),
  };
};

const hasChanged = (prev, next) =>
  Object.keys(next).some((key) => prev[key] !== next[key]);

export function useEditorState(editor) {
  const [state, setState] = useState(() => getEditorState(editor));
  const stateRef = useRef(state);

  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      const next = getEditorState(editor);
      if (hasChanged(stateRef.current, next)) {
        stateRef.current = next;
        setState(next);
      }
    };

    updateState();
    editor.on("transaction", updateState);
    editor.on("selectionUpdate", updateState);

    return () => {
      editor.off("transaction", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  return state;
}
