import { useState, useEffect } from "react";
import { toast } from "sonner";

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
    if (!newCategory.name.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: newCategory.name.trim(),
      });
      toast.success("Categoria creada correctamente");
      onClose();
    } catch (err) {
      toast.error("Error al crear: " + err.message);
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