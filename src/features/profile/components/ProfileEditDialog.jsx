import { useState, useEffect } from "react";
import { useEditProfile } from "../hooks/useEditProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileEditDialog({ user, onSave, isOpen, onClose }) {
  const { editedData, saving, handleChange, handleSave, handleCancel } =
    useEditProfile(user, onSave, isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              value={editedData.name}
              onChange={handleChange}
              className="selection:bg-rose-500 selection:text-gray-900"
              placeholder="Tu nombre completo"
              disabled={saving}
            />
          </div>

          {/* Email (solo lectura) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">
              El email no se puede modificar
            </p>
          </div>

          {/* Biografía */}
          <div className="space-y-2">
            <Label htmlFor="description">Biografía</Label>
            <Textarea
              id="description"
              name="description"
              value={editedData.description}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={4}
              disabled={saving}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {editedData.description.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer"
              disabled={saving}
              variant="destructive"
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
