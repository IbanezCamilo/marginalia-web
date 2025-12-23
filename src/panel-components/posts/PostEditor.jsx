import React, { useRef } from "react";
import TipTapEditor from "./TipTapEditor";
import { PiUploadSimpleFill } from "react-icons/pi";

export default function PostEditor({ post, onChange }) {
  const inputFileRef = useRef(null);
  //Execute when an archive is selected
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //1. Provide the archive to the parent
    onChange("image", file);

    //2. Generate preview(base64) and pass it to the parent too
    const reader = new FileReader();
    reader.onload = () => {
      onChange("previewUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  //Allows to open the file on click in the overlay or button
  const triggerFileSelect = () => {
    inputFileRef.current?.click();
  };

  return (
    <div>
      {/* TÍTULO */}
      <textarea
        value={post.title}
        onChange={(e) => onChange("title", e.target.value)}
        rows={3}
        className="w-full border-b border-neutral-200 mb-6 p-2 text-4xl font-bold
                   focus:outline-none resize-none max-h-[6rem] overflow-y-auto bg-transparent"
        placeholder="Escribe el título aquí..."
      />

      {/* IMAGEN DESTACADA (preview + overlay para subir) */}
      <div className="relative w-full h-80 rounded-md overflow-hidden group mb-4 bg-gray-50">
        <img
          src={
            post.previewUrl ||
            post.image ||
            "https://cdn.pixabay.com/photo/2020/05/25/17/21/link-5219567_1280.jpg"
          }
          alt="Vista previa"
          className="w-full h-full object-cover"
        />

        {/* Overlay para subir imagen */}
        <div
          onClick={triggerFileSelect}
          className="absolute inset-0 flex flex-col items-center justify-center
                     bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <PiUploadSimpleFill size={28} />
          <span className="mt-2">Subir / Cambiar imagen</span>
        </div>

        {/* Input file oculto */}
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* EDITOR (TipTap) */}
      <div className="w-full">
        {/*TipTapEditor recibe contenido y onChange */}
        <TipTapEditor
          content={post.content}
          onChange={(html) => onChange("content", html)}
        />
      </div>
    </div>
  );
}
