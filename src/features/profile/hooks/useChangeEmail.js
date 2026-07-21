import { useState, useEffect } from "react";
import { toast } from "sonner";
import { userService } from "@/features/profile/services/userService";
import { getErrorMessage } from "@/lib/apiError";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Drives the "change email" dialog: local field state, client-side validation, and the
 * request call. Unlike password change, this does NOT log the user out — the change only
 * takes effect once the new address is confirmed via the emailed link, so the current
 * session stays valid.
 */
export function useChangeEmail(isOpen, onClose) {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setNewEmail("");
      setCurrentPassword("");
      setShowPassword(false);
      setFieldErrors({});
    }
  }, [isOpen]);

  const handleSave = async () => {
    const trimmedEmail = newEmail.trim();
    const errors = {};
    if (!trimmedEmail) errors.newEmail = "Ingresa tu nuevo correo.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) errors.newEmail = "Ingresa un correo válido.";
    if (!currentPassword.trim()) errors.currentPassword = "Ingresa tu contraseña actual.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSaving(true);
      await userService.changeEmail({ newEmail: trimmedEmail, currentPassword });
      toast.success(
        `Te enviamos un enlace de confirmación a ${trimmedEmail}. Tu correo actual seguirá activo hasta que lo confirmes.`
      );
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo solicitar el cambio de correo."));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return {
    newEmail,
    setNewEmail,
    currentPassword,
    setCurrentPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    saving,
    fieldErrors,
    handleSave,
    handleCancel,
  };
}
