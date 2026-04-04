import { useState } from "react";
import { useEditorState } from "@/features/posts/hooks/useEditorState";

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
  const closeLinkModal = () => setShowLinkModal(false);

  const handleLinkSubmit = (url) => {
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    closeLinkModal();
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-white">
        {/* Inline */}
        <InlineControls
          editor={editor}
          state={state}
          onLinkClick={openLinkModal}
        />

        {/* Block */}
        <BlockControls editor={editor} state={state} />

        {/* Align */}
        <AlignControls editor={editor} />

        {/* History */}
        <HistoryControls editor={editor} state={state} />
      </div>

      {/* Link Modal */}
      <LinkModal
        editor={editor}
        open={showLinkModal}
        onSubmit={handleLinkSubmit}
        onOpenChange={setShowLinkModal}
      />
    </>
  );
}
