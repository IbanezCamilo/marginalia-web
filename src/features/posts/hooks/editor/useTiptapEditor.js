import { useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { editorExtensions } from "@/features/posts/components/editor/tiptap/editorExtensions";
import {
  parseEditorContent,
  serializeEditorContent,
} from "@/features/posts/utils/editorContent";

export function useTiptapEditor({ content = "", onChange, editable = true }) {
  const lastSyncedContent = useRef(content);

  const editor = useEditor({
    extensions: editorExtensions,
    content: parseEditorContent(content),
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const nextContent = serializeEditorContent(editor);
      lastSyncedContent.current = nextContent;
      onChange(nextContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none break-words focus:outline-none overflow-x-hidden min-h-[420px] px-6 py-5",
      },
    },
  });

  useEffect(() => {
    if (!editor || content === undefined || content === lastSyncedContent.current) {
      return;
    }

    editor.commands.setContent(parseEditorContent(content), false);
    lastSyncedContent.current = content;
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  return editor;
}
