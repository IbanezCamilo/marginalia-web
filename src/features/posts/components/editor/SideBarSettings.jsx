import { ComboBox } from "@/components/ui/comboBox";
import { FolderOpen, Eye, EyeOff } from "lucide-react";

export default function SideBarSettings({ categories, post, onChange }) {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
          Configuración
        </h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <FolderOpen size={16} className="text-stone-400" />
          Categoría
          <span className="text-rose-500">*</span>
        </label>

        <ComboBox
          items={categories}
          value={post.categoryId}
          onChange={(value) => onChange("categoryId", value)}
          displayKey="name"
          valueKey="id"
          placeholder="Selecciona una categoría"
        />
        {!post.categoryId && (
          <p className="text-xs text-stone-500 leading-relaxed">
            Ayuda a clasificar tu contenido y mejora el descubrimiento
          </p>
        )}
      </div>

      <div className="border-t border-stone-200" />

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
          {post.status === "PUBLISHED" ? (
            <Eye size={16} className="text-emerald-600" />
          ) : (
            <EyeOff size={16} className="text-stone-400" />
          )}
          Estado
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              post.status === "PUBLISHED"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200 space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>
            {post.createdAt
              ? `Creado: ${new Date(post.createdAt).toLocaleDateString("es-CO")}`
              : "Sin guardar"}
          </span>
        </div>
        {post.updatedAt && post.updatedAt !== post.createdAt && (
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>
              Última edición:{" "}
              {new Date(post.updatedAt).toLocaleDateString("es-CO")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
