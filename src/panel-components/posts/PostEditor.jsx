import React, { useRef } from "react";
import { PiUploadSimpleFill } from "react-icons/pi";
import CoverImageUpload from "./CoverImageUpload";
import TitleInput from "./TitleInput";
import TipTapEditor from "./TipTapEditor";

export default function PostEditor({ post, onChange }) {
  return (
    <div>
      {/* IMAGEN DESTACADA (preview + overlay para subir) */}
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
