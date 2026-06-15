import { ComboBox } from "@/components/ui/comboBox";
import { FolderOpen, Eye, EyeOff, AlertTriangle, Lock } from "lucide-react";
import { getPostStatusConfig } from "@/features/posts/utils/postStatus";

export default function SideBarSettings({ categories, post, onChange }) {
  const isRejected = post.status === "REJECTED";
  const isArchived = post.status === "ARCHIVED";
  const statusBadge = getPostStatusConfig(post.status);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
          Configuración
        </h3>
      </div>

      {isRejected && (
        <div className="space-y-2 rounded-md border border-rose-200 bg-rose-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-800">
            <AlertTriangle size={16} />
            Comentarios del moderador
          </p>
          {post.moderationNote && (
            <p className="text-sm leading-relaxed text-rose-800">{post.moderationNote}</p>
          )}
          <p className="text-xs font-medium text-rose-700">
            Intentos de rechazo: {post.rejectionCount ?? 0}/3
          </p>
          {post.isLastAttempt && (
            <p className="text-xs font-semibold text-amber-700">
              Última oportunidad: si se rechaza de nuevo, el post será archivado
              permanentemente.
            </p>
          )}
        </div>
      )}

      {isArchived && (
        <div className="space-y-2 rounded-md border border-stone-300 bg-stone-100 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-stone-700">
            <Lock size={16} />
            Post archivado
          </p>
          <p className="text-sm leading-relaxed text-stone-600">
            Este post está archivado y no puede editarse ni reenviarse. Si crees que es un
            error, contacta a un administrador.
          </p>
          {post.moderationNote && (
            <p className="text-sm leading-relaxed text-stone-600">
              <span className="font-medium">Motivo: </span>
              {post.moderationNote}
            </p>
          )}
        </div>
      )}

      <div className={`space-y-3 ${isArchived ? "pointer-events-none opacity-60" : ""}`}>
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
            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.badgeClass}`}
          >
            {statusBadge.label}
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
