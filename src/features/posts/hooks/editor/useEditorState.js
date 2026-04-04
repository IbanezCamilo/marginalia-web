import { useState, useEffect } from "react";

export function useEditorState(editor) {
  // This hook manages the editor state
  const [state, setState] = useState({});

  useEffect(() => {
    // Only update state if the editor is defined
    if (!editor) return;

    // Update the current state
    const updateState = () => {
      //Check if there's a text selection or if the cursor is on an existing link
      const { from, to } = editor.state.selection;
      const hasSelection = from != to || editor.isActive("link");
      setState({
        isBold: editor.isActive("bold"),
        canBold: editor.can().chain().toggleBold().run(),
        isItalic: editor.isActive("italic"),
        canItalic: editor.can().chain().toggleItalic().run(),
        isStrike: editor.isActive("strike"),
        canStrike: editor.can().chain().toggleStrike().run(),
        isUnderline: editor.isActive("underline"),
        canUnderline: editor.can().chain().toggleUnderline().run(),
        isLink: editor.isActive("link"),
        canLink:
          hasSelection && editor.can().chain().setLink({ href: "" }).run(),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        isBulletList: editor.isActive("bulletList"),
        canBulletList: editor.can().chain().toggleBulletList().run(),
        isOrderedList: editor.isActive("orderedList"),
        canOrderedList: editor.can().chain().toggleOrderedList().run(),
        isBlockquote: editor.isActive("blockquote"),
        canBlockquote: editor.can().chain().toggleBlockquote().run(),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isHeading3: editor.isActive("heading", { level: 3 }),
        isLeft: editor.isActive({ textAlign: "left" }),
        isCenter: editor.isActive({ textAlign: "center" }),
        isRight: editor.isActive({ textAlign: "right" }),
        isJustify: editor.isActive({ textAlign: "justify" }),
      });
    };

    // Initialize state
    updateState();
    // Fired when editor content changes (typing, deleting)
    editor.on("update", updateState);
    // Fired when text selection changes (even without typing)
    editor.on("selectionUpdate", updateState);

    // Clean up listeners on component unmount to prevent memory leaks
    return () => {
      editor.off("update", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  return state;
}