import { useState, useEffect } from "react";
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

export default function LinkModal({ editor, open, onOpenChange }) {
  /**
   * LinkModal Component
   *
   * Modal dialog for adding/editing links in the editor
   * @param {Object} editor - The TipTap editor instance
   * @param {boolean} open - boolean that controls modal visibility(comes from showLinkModal)
   * @param {Function} onOpenChange - callback Function to change the state(comes from setShowLinkModal)
   * @returns {JSX.Element} Statistics display component
   *
   */
  const [url, setUrl] = useState(""); //Local State to storage URL; void Inicialize
  const [error, setError] = useState(""); // State to validation error messages

  useEffect(() => {
    if (open) {
      const current = editor.getAttributes("link"); //the current selection has a Link?
      setUrl(current.href || ""); //true: edit a existent link; false: create a new link
      setError(""); // clean every prev error
    }
  }, [open, editor]);

  //Validation function
  const isValidUrl = (urlString) => {
    // recieve a Url as String
    try {
      const urlObj = new URL(urlString); //Javascript Function to validate the URL
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"; // Verify the protocols for security
    } catch (e) {
      return false;
    }
  };

  const handleInsert = () => {
    setError("");

    //validation to verify if the url is empty
    if (!url.trim()) {
      setError("URL requerida");
      return;
    }

    //Add the protocol in the url (if it's missing)
    let finalUrl = url.trim(); // remove blank space
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // url has a protocol?
      finalUrl = "https://" + finalUrl; //if not concatened the protocol in the url
    }

    //Validate the complete format
    if (!isValidUrl(finalUrl)) {
      setError("Porfavor ingresa un URL valido");
      return;
    }

    //Apply the link in the editor
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: finalUrl })
      .run();

    //Clean and close
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  //Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInsert();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editor.getAttributes("link").href
              ? "Editar Link"
              : "Insertar Link"}
          </DialogTitle>
          <DialogDescription>
            Ingresa la URL del enlace que desees agregar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="link" className="py-2">
              URL
            </Label>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com"
              autoFocus
            />
            {/**Error message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          {/**Buttons */}
          <div className="flex justify-end gap-2">
            {editor.getAttributes("link").href && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  onOpenChange(false);
                }}
              >
                Eliminar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleInsert}>
              {editor.getAttributes("link").href ? "Actualizar" : "Insertar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
