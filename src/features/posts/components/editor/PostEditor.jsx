import CoverImageUpload from "./CoverImageUpload";
import TitleInput from "./TitleInput";
import TipTapEditor from "./tiptap/TiptapEditor";

export default function PostEditor({ post, onChange, readOnly = false }) {
  return (
    <div className="space-y-6">
      <CoverImageUpload
        previewUrl={post.previewUrl}
        imageSrc={post.image}
        onChange={onChange}
        readOnly={readOnly}
      />
      {/* Title */}
      <TitleInput
        value={post.title}
        onChange={(value) => onChange("title", value)}
        readOnly={readOnly}
      />

      <TipTapEditor
        content={post.content}
        onChange={(content) => onChange("content", content)}
        editable={!readOnly}
      />
    </div>
  );
}
