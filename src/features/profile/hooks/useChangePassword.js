import { useState, useEffect } from "react";
import { toast } from "sonner";
import { userService } from "@/features/profile/services/userService";
import { getErrorMessage } from "@/lib/apiError";

export function useChangePassword(isOpen, onClose) {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setFieldErrors({});
    }
  }, [isOpen]);

  const handleSave = async () => {
    const errors = {};
    if (!currentPassword.trim()) errors.currentPassword = "Ingresa tu contraseña actual.";
    if (!newPassword.trim()) errors.newPassword = "Ingresa una nueva contraseña.";
    else if (newPassword.length < 8) {
      errors.newPassword = "La nueva contraseña debe tener al menos 8 caracteres.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSaving(true);
      await userService.changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada correctamente");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo cambiar la contraseña."));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    showCurrentPassword,
    toggleShowCurrentPassword: () => setShowCurrentPassword((v) => !v),
    showNewPassword,
    toggleShowNewPassword: () => setShowNewPassword((v) => !v),
    saving,
    fieldErrors,
    handleSave,
    handleCancel,
  };
}
