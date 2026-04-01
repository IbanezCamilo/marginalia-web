import { useState } from "react";
import { useUploadImage } from "../hooks/useUploadImage";
import { FaCamera, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfileImageUpload({
  currentImage,
  onImageUpdated,
  isOpen,
  onClose,
}) {
  const {
    preview,
    selectedFile,
    uploading,
    handleFileSelect,
    handleUpload,
    handleCancel,
  } = useUploadImage(onImageUpdated, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview de la imagen */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={preview || currentImage}
                alt="Preview"
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />

              {/* Botón de selección superpuesto */}
              <label
                htmlFor="image-upload-input"
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-opacity-50 transition-all cursor-pointer rounded-full group"
              >
                <FaCamera className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </label>

              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </div>

          {/* Instrucctions */}
          {!selectedFile ? (
            <p className="text-center text-sm text-gray-600">
              Haz clic en la imagen para seleccionar una nueva foto
            </p>
          ) : (
            <p className="text-center text-sm text-green-600 bg-green-50 p-2 rounded">
              ✓ Nueva imagen seleccionada
            </p>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              className="flex-1"
              disabled={!selectedFile || uploading}
              variant="destructive"
            >
              {uploading ? "Subiendo..." : "Guardar foto"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={uploading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
