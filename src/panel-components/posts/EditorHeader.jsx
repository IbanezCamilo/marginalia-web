import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft, Save } from "lucide-react";

export default function EditorHeader({
  onSaveDraft,
  onPublish,
  submitting,
  hasChanges,
}) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="h-16 px-6 flex items-center justify-between">
        {/**Navegation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 tex-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="text-sm font-medium">Volver</span>
          </button>

          {/**Changes not saved indicator */}
          {hasChanges && !submitting && (
            <span className="text-xs text-amber-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse">
                Sin guardar
              </span>
            </span>
          )}

          {/* Saved indicator*/}
          {submitting && (
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg
                className="animate-spin h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
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

        {/** Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={submitting}
            className="font-medium"
          >
            <Save size={16} className="mr-2" />
            Guardar Borrador
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onPublish}
            disabled={submitting}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6"
          >
            {submitting ? "Publicando" : "Publicar"}
          </Button>
        </div>
      </div>
    </header>
  );
}
