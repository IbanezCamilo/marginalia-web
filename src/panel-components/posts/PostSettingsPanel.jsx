import { useState, useEffect } from "react";
import { ComboBox } from "@/components/ui/comboBox";
import { Button } from "@/components/ui/button";

export default function PostSettingsPanel({
  post,
  onChange,
  categories = [],
  onSubmit,
  submitting = false,
}) {
  /**
   * Manage the click on "Save Draft"
   */
  const handleDraft = () => {
    onSubmit(null, "DRAFT");
  };

  /**
   * Manage the click on "Publish"
   */
  const handlePublish = () => {
    onSubmit(null, "PUBLISHED");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Categoría */}
      <div>
        <ComboBox
          label="Categoría"
          items={categories}
          itemToString={(item) => (item ? item.name : "")}
          value={post.idCategory}
          onChange={(newValue) => onChange("idCategory", newValue)}
          placeholder="Seleccion una categoría"
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Etiquetas 
      <div>
        <label className="block text-sm font-medium">Etiquetas</label>
        <TagInput
          value={post.tags}
          onChange={(tags) => onChange("tags", tags)}
        />
      </div>
*/}
      {/* Autores 
      <div>
        <label className="block text-sm font-medium">Autores</label>
        <select
          multiple
          value={post.authors}
          onChange={(e) =>
            onChange(
              "authors",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          className="w-full border rounded-md p-2"
        >
          {authors.map((a) => (
            <option key={a.idUser} value={a.idUser}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      */}

      {/* Estado */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          type="button"
          className="flex-1 bg-gray-100 py-2 rounded-md cursor-pointer"
          onClick={handleDraft}
          disabled={submitting}
        >
          {submitting ? "Guardando..." : "Guardar Borrador"}
        </Button>
        <Button
          variant="destructive"
          type="button"
          className="flex-1 bg-red-500 text-white py-2 rounded-md cursor-pointer"
          onClick={handlePublish}
          disabled={submitting}
        >
          {submitting ? "Publicando..." : "Publicar"}
        </Button>
      </div>
      {/* ===== INFORMACIÓN ADICIONAL ===== */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Puedes guardar tu post como borrador y
          publicarlo más tarde.
        </p>
      </div>
    </div>
  );
}
