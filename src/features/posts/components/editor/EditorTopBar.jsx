import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditorTopbar({
  onSaveDraft,
  onPublish,
  submitting,
  hasChanges,
  readOnly = false,
}) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 mb-2">
      <div className="h-16 px-6 gap-4 flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/6">
          <button
            type="button"
            onClick={() => navigate("/user/posts")}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors min-h-[44px]"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          <div
            aria-hidden={!hasChanges || submitting}
            className={`flex items-center gap-2 text-xs font-semibold transition-opacity duration-200 ${
              hasChanges && !submitting ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
            <span className="hidden md:inline text-amber-500 whitespace-nowrap">
              Cambios sin guardar
            </span>
            <span className="md:hidden text-amber-500 whitespace-nowrap">
              Sin guardar
            </span>
          </div>

          {submitting && (
            <span className="text-xs text-stone-400 flex items-center gap-1.5">
              <svg
                className="animate-spin h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {readOnly ? (
            <span className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-500 min-h-[44px]">
              <Lock size={16} aria-hidden="true" />
              Archivado — solo lectura
            </span>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveDraft}
                disabled={submitting}
                className="font-medium min-h-[44px] border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                <Save size={16} className="flex justify-center md:mr-2 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline text-sm">Guardar Borrador</span>
              </Button>
              <Button
                size="sm"
                onClick={onPublish}
                disabled={submitting}
                className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-6 min-h-[44px]"
              >
                {submitting ? "Publicando…" : "Publicar"}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
