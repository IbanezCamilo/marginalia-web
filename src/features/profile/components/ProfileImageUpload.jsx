import { useUploadImage } from "../hooks/useUploadImage";
import { Camera } from "lucide-react";
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
  onImageDeleted,
  isDeleting = false,
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
  } = useUploadImage(onImageUpdated, onClose, isOpen);

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
                className="w-48 h-48 rounded-full object-cover border-4 border-stone-200 shadow-lg"
              />

              {/* Botón de selección superpuesto */}
              <label
                htmlFor="image-upload-input"
                className="absolute inset-0 flex items-center justify-center rounded-full transition-all cursor-pointer group hover:bg-black/40"
              >
                <Camera size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
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

          {!selectedFile ? (
            <p className="text-center text-sm text-stone-500">
              Haz clic en la imagen para seleccionar una nueva foto
            </p>
          ) : (
            <p className="text-center text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-md">
              Nueva imagen seleccionada
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              className="flex-1 bg-rose-700 hover:bg-rose-800"
              disabled={!selectedFile || uploading}
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

          {onImageDeleted && !selectedFile && (
            <Button
              onClick={onImageDeleted}
              variant="outline"
              className="w-full text-destructive border-destructive/20 hover:bg-destructive/5"
              disabled={uploading || isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar foto de perfil"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
