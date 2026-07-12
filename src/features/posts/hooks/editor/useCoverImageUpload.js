import { useRef } from "react";
import { toast } from "sonner";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_SIZE = 5 * 1024 * 1024;

export function useCoverImageUpload(onChange) {

  const inputFileRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("La imagen es muy grande. Máximo 5MB.");
      return;
    }

    onChange("image", file);

    const reader = new FileReader();
    reader.onload = () => {
      onChange("previewUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange("image", null);
    onChange("previewUrl", "");
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    inputFileRef.current?.click();
  };

  return {onChange, inputFileRef, handleImageSelect, handleRemoveImage, triggerFileSelect}
}