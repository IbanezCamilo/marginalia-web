import React, { useRef } from "react";
import CoverImageUpload from "./CoverImageUpload";
import TitleInput from "./TitleInput";
import TipTapEditor from "./TipTapEditor";

export default function PostEditor({ post, onChange }) {
  const inputFileRef = useRef(null);

  return (
    <div className="space-y-6">
      <CoverImageUpload
        previewUrl={post.previewUrl}
        imageSrc={post.image}
        onChange={onChange}
      />
      {/* Title */}
      <TitleInput
        title={post.title}
        onChange={(value) => onChange("title", value)}
      />

      {/* EDITOR (TipTap) */}
      {/*TipTapEditor recibe contenido y onChange */}
      <TipTapEditor
        content={post.content}
        onChange={(html) => onChange("content", html)}
      />
    </div>
  );
}
