import { useState } from "react";
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
  const [editedData, setEditedData] = useState({
    name: user.name,
    bio: user.bio,
  });
  const [saving, setSaving] = useState(false);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedData);
      onClose();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancelar
  const handleCancel = () => {
    setEditedData({
      name: user.name,
      bio: user.bio,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
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
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              name="bio"
              value={editedData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={4}
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              {editedData.bio.length}/500 caracteres
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
