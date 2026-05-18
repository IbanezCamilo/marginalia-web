import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "@/features/posts/hooks/editor/useTiptapEditor";
import EditorToolbar from "./EditorToolbar";
import WordCount from "./WordCount";
import "./TipTapEditor.css";

export default function TiptapEditor({ content, onChange }) {
  const editor = useTiptapEditor({ content, onChange });

  if (!editor) return null;

  return (
    <section className="w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <EditorToolbar editor={editor} />
      <div className="max-h-[640px] w-full overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
      <WordCount editor={editor} />
    </section>
  );
}
