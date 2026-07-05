import { useState } from "react";
import { useCoverImageUpload } from "../../hooks/editor/useCoverImageUpload";
import { ImageIcon } from "lucide-react";
import { focalToObjectPosition } from "@/utils/imageUtils";
import FocalPointPicker from "./FocalPointPicker";

export default function CoverImageUpload({
  previewUrl,
  imageSrc,
  focalX = 0.5,
  focalY = 0.5,
  onChange,
  readOnly = false,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const {
    inputFileRef,
    handleImageSelect,
    handleRemoveImage,
    triggerFileSelect,
  } = useCoverImageUpload(onChange);

  if (!previewUrl && !imageSrc) {
    if (readOnly) return null;

    return (
      <div className="mb-8">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-full h-64 border-2 border-dashed border-border rounded-xl
                     flex flex-col items-center justify-center gap-4
                     hover:border-stone-400 hover:bg-muted dark:hover:border-stone-500 transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                     group cursor-pointer"
        >
          <div
            className="w-16 h-16 rounded-full bg-muted flex items-center justify-center
                          group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors"
          >
            <ImageIcon size={32} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">
              Agregar imagen de portada
            </p>
            <p className="text-xs text-muted-foreground">Recomendado: 1600 × 840</p>
          </div>
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    );
  }

  const src = previewUrl || imageSrc;

  // Read-only (moderation / preview): honor the saved focal point, no controls.
  if (readOnly) {
    return (
      <div className="relative mb-8">
        <div className="relative w-full h-96 rounded-xl overflow-hidden bg-muted">
          <img
            src={src}
            alt="Imagen de portada"
            onLoad={() => setImgLoaded(true)}
            style={{ objectPosition: focalToObjectPosition(focalX, focalY) }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <FocalPointPicker
        src={src}
        focalX={focalX}
        focalY={focalY}
        onChange={onChange}
        onChangeImage={triggerFileSelect}
        onRemoveImage={handleRemoveImage}
      />
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </>
  );
}
