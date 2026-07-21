import { Eye, EyeOff } from "lucide-react";
import { useChangeEmail } from "../hooks/useChangeEmail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/shared/components/FieldError";

export default function ChangeEmailDialog({ isOpen, onClose }) {
  const {
    newEmail,
    setNewEmail,
    currentPassword,
    setCurrentPassword,
    showPassword,
    toggleShowPassword,
    saving,
    fieldErrors,
    handleSave,
    handleCancel,
  } = useChangeEmail(isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar correo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Te enviaremos un enlace de confirmación al nuevo correo. Tu correo actual
            seguirá activo hasta que lo confirmes.
          </p>

          <div className="space-y-2">
            <Label htmlFor="newEmail">Nuevo correo</Label>
            <Input
              id="newEmail"
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              disabled={saving}
              aria-invalid={!!fieldErrors.newEmail}
              aria-describedby={fieldErrors.newEmail ? "newEmail-error" : undefined}
            />
            <FieldError id="newEmail-error">{fieldErrors.newEmail}</FieldError>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPasswordForEmail">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="currentPasswordForEmail"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Tu contraseña actual"
                disabled={saving}
                aria-invalid={!!fieldErrors.currentPassword}
                aria-describedby={fieldErrors.currentPassword ? "currentPasswordForEmail-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError id="currentPasswordForEmail-error">{fieldErrors.currentPassword}</FieldError>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer bg-rose-700 hover:bg-rose-800"
              disabled={saving}
            >
              {saving ? "Enviando..." : "Enviar enlace"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 cursor-pointer"
              disabled={saving}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
