import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const normalizeUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function LinkModal({ editor, open, onOpenChange }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !editor) return;
    setUrl(editor.getAttributes("link").href ?? "");
    setError("");
  }, [open, editor]);

  const closeModal = () => {
    setError("");
    onOpenChange(false);
  };

  const handleInsert = () => {
    const finalUrl = normalizeUrl(url);

    if (!finalUrl) {
      setError("Ingresa una URL.");
      return;
    }

    if (!isValidUrl(finalUrl)) {
      setError("Ingresa una URL valida.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: finalUrl })
      .run();

    closeModal();
  };

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  };

  const hasLink = Boolean(editor?.getAttributes("link").href);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasLink ? "Editar enlace" : "Agregar enlace"}</DialogTitle>
          <DialogDescription>
            Los enlaces se guardan con protocolos seguros para proteger la lectura.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="editor-link-url" className="py-2">
              URL
            </Label>
            <Input
              id="editor-link-url"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleInsert();
              }}
              placeholder="https://ejemplo.com"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            {hasLink && (
              <Button type="button" variant="outline" onClick={handleRemove}>
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleInsert}
              className="bg-rose-700 text-white hover:bg-rose-800"
            >
              {hasLink ? "Actualizar" : "Insertar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
