import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

export function useCreateCategory( onSave, isOpen, onClose ){
    
  const [newCategory, setNewCategory] = useState({
    name: "",
    });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewCategory({
        name: "",
      });
    }
  }, [isOpen]);

  // Handle input and changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    const trimmed = newCategory.name.trim();
    if (!trimmed) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (trimmed.length < 2) {
      toast.error("El nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (trimmed.length > 100) {
      toast.error("El nombre no puede superar los 100 caracteres.");
      return;
    }

    try {
      setSaving(true);
      await onSave({ name: trimmed });
      toast.success("Categoria creada correctamente");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo crear la categoría."));
    } finally {
      setSaving(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setNewCategory({
      name: "",
    });
    onClose();
  };

  return {
    newCategory,
    saving,
    handleChange,
    handleSave,
    handleCancel
  }

}