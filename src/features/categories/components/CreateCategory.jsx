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

export default function CreateCategory({ onSave, isOpen, onClose }) {
  const { newCategory, saving, handleChange, handleSave, handleCancel } =
    useCreateCategory(onSave, isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-md border-stone-200">
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
              disabled={saving}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer bg-stone-950 hover:bg-rose-900"
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
