import { useState } from "react";
import { useEditorState } from "@/features/posts/hooks/editor/useEditorState";
import InlineControls from "./controls/InlineControls";
import BlockControls from "./controls/BlockControls";
import AlignControls from "./controls/AlignControls";
import HistoryControls from "./controls/HistoryControls";
import LinkModal from "./LinkModal";

export default function EditorToolbar({ editor }) {
  const state = useEditorState(editor);
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!editor) return null;

  const openLinkModal = () => setShowLinkModal(true);

  return (
    <>
      <div
        role="toolbar"
        aria-label="Formato de texto"
        className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-3 py-2 backdrop-blur"
      >
        <BlockControls editor={editor} state={state} />
        <InlineControls
          editor={editor}
          state={state}
          onLinkClick={openLinkModal}
        />
        <AlignControls editor={editor} state={state} />
        <HistoryControls editor={editor} state={state} />
      </div>

      <LinkModal
        editor={editor}
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
      />
    </>
  );
}
