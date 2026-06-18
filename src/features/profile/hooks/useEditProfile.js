import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

export function useEditProfile( user, onSave, isOpen, onClose ){
    
  const [editedData, setEditedData] = useState({
    name: user.name,
    description: user.description,
    });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setEditedData({
        name: user.name || "",
        description: user.description || "",
      });
    }
  }, [isOpen, user]);

  // Handle input and changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    if (!editedData.name.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: editedData.name.trim(),
        description: (editedData.description || "").trim(),
      });
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo guardar el perfil."));
    } finally {
      setSaving(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setEditedData({
      name: user.name,
      description: user.description,
    });
    onClose();
  };

  return {
    editedData,
    saving,
    handleChange,
    handleSave,
    handleCancel,
  }

}