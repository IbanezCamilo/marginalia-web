import { Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "../hooks/useChangePassword";
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

export default function ChangePasswordDialog({ isOpen, onClose }) {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showCurrentPassword,
    toggleShowCurrentPassword,
    showNewPassword,
    toggleShowNewPassword,
    saving,
    fieldErrors,
    handleSave,
    handleCancel,
  } = useChangePassword(isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contraseña actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Tu contraseña actual"
                disabled={saving}
                aria-invalid={!!fieldErrors.currentPassword}
                aria-describedby={fieldErrors.currentPassword ? "currentPassword-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowCurrentPassword}
                tabIndex={-1}
                aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError id="currentPassword-error">{fieldErrors.currentPassword}</FieldError>
          </div>

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                disabled={saving}
                aria-invalid={!!fieldErrors.newPassword}
                aria-describedby={fieldErrors.newPassword ? "newPassword-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowNewPassword}
                tabIndex={-1}
                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError id="newPassword-error">{fieldErrors.newPassword}</FieldError>
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                disabled={saving}
                aria-invalid={!!fieldErrors.confirmNewPassword}
                aria-describedby={fieldErrors.confirmNewPassword ? "confirmNewPassword-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowNewPassword}
                tabIndex={-1}
                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError id="confirmNewPassword-error">{fieldErrors.confirmNewPassword}</FieldError>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer bg-rose-700 hover:bg-rose-800"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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
