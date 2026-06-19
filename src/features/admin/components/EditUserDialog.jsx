import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboBox } from "@/components/ui/comboBox";
import { getErrorMessage } from "@/lib/apiError";

const ROLE_OPTIONS = [
  { id: "ADMIN", name: "Administrador" },
  { id: "AUTHOR", name: "Autor" },
  { id: "MODERATOR", name: "Moderador" },
  { id: "READER", name: "Lector" },
];

export default function EditUserDialog({ isOpen, user, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", email: "", roleName: "READER" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        roleName: user.role?.name ?? "READER",
      });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (!email) {
      toast.error("El email no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);
      await onSave(user.id, { name, email, roleName: form.roleName });
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo actualizar el usuario."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-md border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Editar usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre</Label>
            <Input
              id="edit-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <ComboBox
              label="Rol"
              items={ROLE_OPTIONS}
              value={form.roleName}
              onChange={(val) => setForm((prev) => ({ ...prev, roleName: val }))}
              valueKey="id"
              displayKey="name"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer bg-rose-700 hover:bg-rose-800"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              onClick={onClose}
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
