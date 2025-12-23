import { useState, useEffect } from "react";
import { ComboBox } from "@/components/ui/comboBox";
import { Button } from "@/components/ui/button";
import { categoriesDemo } from "../../data/categoriesDemo";

export default function PostSettingsPanel({ post, onChange, categories = [] }) {
  //const [categories, setCategories] = useState([]);
  //const [authors, setAuthors] = useState([]);

  /*
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then(setCategories);
    
    fetch("http://localhost:8080/api/authors")
      .then((res) => res.json())
      .then(setAuthors);
  }, []);
  */

  return (
    <div className="flex flex-col gap-4">
      {/* Categoría */}
      <div>
        <ComboBox
          label="Categoría"
          items={categories.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
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
          onClick={() => onChange("estado", "BORRADOR")}
        >
          Guardar borrador
        </Button>
        <Button
          variant="destructive"
          type="button"
          className="flex-1 bg-red-500 text-white py-2 rounded-md cursor-pointer"
          onClick={() => onChange("estado", "PUBLICADO")}
        >
          Publicar
        </Button>
      </div>
    </div>
  );
}
