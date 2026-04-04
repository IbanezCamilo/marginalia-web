import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineEditor from "@tiptap/extension-underline";  // ← faltaba
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

export function useTiptapEditor({content = "", onChange}){
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineEditor,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-rose-600 underline hover:text-rose-700 transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder: "Empieza a escribir tu próxima historia...",
      }),
      CharacterCount,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
    ],

    content: content || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none break-words focus:outline-none overflow-x-hidden min-h-[300px] p-2",
      },
    }
  });

  return editor;    
}