import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useUploadImage(
    onImageUpdated,
    onClose,
    isOpen,
){
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  //clean state when dialog opens
  useEffect(() => {
    setPreview(null);
    setSelectedFile(null);
  }, [isOpen]);
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    // If there is no file (cancel)
    if (!file) return;

    if (!(file instanceof File)) {
      toast.error("Archivo inválido");
      return;
    }

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato no permitido. Usa JPG, PNG, WEBP o GIF.");
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

  // Upload Image to server
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await onImageUpdated(selectedFile);

      // Clean and close
      setPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      toast.error("Error al subir la imagen: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  //    Clean and cancel
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