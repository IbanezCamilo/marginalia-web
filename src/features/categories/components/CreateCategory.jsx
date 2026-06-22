import { useCreateCategory } from "../hooks/useCreateCategory";
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

export default function CreateCategory({ onSave, isOpen, onClose }) {
  const { newCategory, saving, fieldErrors, handleChange, handleSave, handleCancel } =
    useCreateCategory(onSave, isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-md border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Crear Categoria
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la categoria</Label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              placeholder="Ej: Ensayo, Poesia, Resenas"
              maxLength={100}
              disabled={saving}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "category-name-error" : undefined}
            />
            <FieldError id="category-name-error">{fieldErrors.name}</FieldError>
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
