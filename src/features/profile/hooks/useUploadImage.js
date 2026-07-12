import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

export function useUploadImage(
    onImageUpdated,
    onClose,
    isOpen,
){
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(null);
    setSelectedFile(null);
  }, [isOpen]);
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!(file instanceof File)) {
      toast.error("Archivo inválido");
      return;
    }

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.warning("La imagen es muy grande. Máximo 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await onImageUpdated(selectedFile);

      setPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo subir la imagen."));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  return {
    preview,
    selectedFile,
    uploading,
    handleFileSelect,
    handleUpload,
    handleCancel
   }
}