import { useState } from "react";
import { useCoverImageUpload } from "../../hooks/editor/useCoverImageUpload";
import { Upload, X, ImageIcon } from "lucide-react";

export default function CoverImageUpload({ previewUrl, imageSrc, onChange }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const {
    inputFileRef,
    handleImageSelect,
    handleRemoveImage,
    triggerFileSelect,
  } = useCoverImageUpload(onChange);

  if (!previewUrl && !imageSrc) {
    return (
      <div className="mb-8">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-full h-64 border-2 border-dashed border-stone-300 rounded-xl
                     flex flex-col items-center justify-center gap-4
                     hover:border-stone-400 hover:bg-stone-50 transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                     group cursor-pointer"
        >
          <div
            className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center
                          group-hover:bg-stone-200 transition-colors"
          >
            <ImageIcon size={32} className="text-stone-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-stone-700 mb-1">
              Agregar imagen de portada
            </p>
            <p className="text-xs text-stone-500">Recomendado: 1600 × 840</p>
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

  return (
    <div className="relative mb-8 group">
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-stone-100">
        <img
          src={previewUrl || imageSrc}
          alt="Imagen de portada"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="absolute inset-0 flex items-end justify-start gap-2 bg-gradient-to-t from-black/30 p-4">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                       font-medium text-sm hover:bg-white transition-colors shadow-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Upload size={16} />
          Cambiar
        </button>

        <button
          type="button"
          onClick={handleRemoveImage}
          className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                       font-medium text-sm text-destructive hover:bg-white transition-colors shadow-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X size={16} />
          Eliminar
        </button>
      </div>

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
