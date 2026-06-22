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

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error("Completa ambos campos de contraseña.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

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
    handleSave,
    handleCancel,
  };
}
