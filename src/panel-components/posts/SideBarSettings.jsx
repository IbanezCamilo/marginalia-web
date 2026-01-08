import { ComboBox } from "@/components/ui/comboBox";
import { FolderOpen, Tag, Eye, EyeOff, Calendar } from "lucide-react";

export default function SideBarSettings({ categories, post, onChange }) {
  return (
    <div className="p-6 space-y-8">
      {/**SideBar Header */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Configuracion
        </h3>
      </div>

      {/**Categories */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FolderOpen size={16} className="text-gray-400" />
          Categoría
          <span className="text-rose-500">*</span>
        </label>

        <ComboBox
          items={categories}
          value={post.idCategory}
          onChange={(value) => onChange("idCategory", value)}
          displayKey="name"
          valueKey="id"
          placeholder="Selecciona una categoría"
        />
        {!post.idCategory && (
          <p className="text-xs text-gray-500 leading-relaxed">
            Ayuda a clasificar tu contenido y mejora el descubrimiento
          </p>
        )}
      </div>

      {/* Divisor */}
      <div className="border-t border-gray-200" />
      {/**Post State */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {post.status === "PUBLISHED" ? (
            <Eye size={16} className="text-green-500" />
          ) : (
            <EyeOff size={16} className="text-gray-400" />
          )}
          Estado
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.status === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>
      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>💡 Tip:</strong> Asegúrate de revisar la ortografía antes de
          publicar. Los posts bien escritos tienen 3x más engagement.
        </p>
      </div>

      {/* Last update */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {/*<Calendar size={14} />*/}
          <span>Última edición: Hoy</span>
        </div>
      </div>
    </div>
  );
}
