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

const ROLE_OPTIONS = [
  { id: "ADMIN", name: "Administrador" },
  { id: "AUTHOR", name: "Autor" },
  { id: "MODERATOR", name: "Moderador" },
  { id: "READER", name: "Lector" },
];

const INITIAL = { name: "", email: "", password: "", roleName: "READER" };

export default function CreateUserDialog({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(INITIAL);
  }, [isOpen]);

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
    if (form.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setSaving(true);
      await onSave({ name, email, password: form.password, roleName: form.roleName });
    } catch (err) {
      let msg = "No se pudo crear el usuario.";
      try {
        const parsed = JSON.parse(err.message);
        msg = parsed.message || parsed.error || msg;
      } catch {
        if (err.message && !err.message.startsWith("Request failed")) msg = err.message;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-md border-stone-200">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Nuevo usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Nombre</Label>
            <Input
              id="create-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Contraseña</Label>
            <Input
              id="create-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={saving}
            />
            <p className="text-xs text-stone-500">Mínimo 8 caracteres.</p>
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
              {saving ? "Creando..." : "Crear"}
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
