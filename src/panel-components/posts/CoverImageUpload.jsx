import React, { useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

export default function CoverImageUpload({ previewUrl, imageSrc, onChange }) {
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

  //Remove Image
  const handleRemoveImage = () => {
    onChange("image", null);
    onChange("previewUrl", "");
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  //Allows to open the file on click in the overlay or button
  const triggerFileSelect = () => {
    inputFileRef.current?.click();
  };

  {
    /**Placeholder: No Images */
  }
  if (!previewUrl && !imageSrc) {
    return (
      <div className="mb-8">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl
                     flex flex-col items-center justify-center gap-4
                     hover:border-gray-400 hover:bg-gray-50 transition-all
                     group cursor-pointer"
        >
          <div
            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center
                          group-hover:bg-gray-200 transition-colors"
          >
            <ImageIcon size={32} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Agregar imagen de portada
            </p>
            <p className="text-xs text-gray-500">Recomendado: 1600 x 840</p>
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

  //Hero image
  return (
    <div className="relative mb-8 group">
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={previewUrl || imageSrc}
          alt="Imagen de portada"
          className="w-full h-full object-cover"
        />
      </div>

      {/**Overlay con acciones */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30">
        <div>
          <button
            type="button"
            onClick={triggerFileSelect}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                         font-medium text-sm hover:bg-white transition-colors shadow-lg"
          >
            <Upload size={16} />
            Cambiar
          </button>

          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg
                         font-medium text-sm text-red-600 hover:bg-white transition-colors shadow-lg"
          >
            <X size={16} />
            Eliminar
          </button>
        </div>
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
