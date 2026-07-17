import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

export function useCreateCategory( onSave, isOpen, onClose ){
    
  const [newCategory, setNewCategory] = useState({
    name: "",
    });
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setNewCategory({
        name: "",
      });
      setFieldErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const trimmed = newCategory.name.trim();
    if (!trimmed) {
      setFieldErrors({ name: "El nombre no puede estar vacío." });
      return;
    }
    if (trimmed.length < 2) {
      setFieldErrors({ name: "El nombre debe tener al menos 2 caracteres." });
      return;
    }
    if (trimmed.length > 100) {
      setFieldErrors({ name: "El nombre no puede superar los 100 caracteres." });
      return;
    }

    setFieldErrors({});
    try {
      setSaving(true);
      await onSave({ name: trimmed });
      toast.success("Categoría creada correctamente");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo crear la categoría."));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewCategory({
      name: "",
    });
    setFieldErrors({});
    onClose();
  };

  return {
    newCategory,
    saving,
    fieldErrors,
    handleChange,
    handleSave,
    handleCancel
  }

}