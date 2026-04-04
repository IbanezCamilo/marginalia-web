import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "@/features/posts/hooks/editor/useTiptapEditor";
import EditorToolbar from "./EditorToolbar";
import WordCount from "./WordCount";
import "./TiptapEditor.css"; // Import custom CSS styles|

export default function TiptapEditor({ content, onChange }) {
  const editor = useTiptapEditor({ content, onChange });

  if (!editor) return null;

  return (
    <div className="w-full">
      {editor && (
        <>
          <EditorToolbar editor={editor} />
        </>
      )}
      <div className="w-full max-h-80 border overflow-auto rounded bg-white">
        <EditorContent editor={editor} />
      </div>

      <WordCount editor={editor} />
    </div>
  );
}
