import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Estas seguro?",
  description = "Esta acción no se puede deshacer",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "destructive",
  loading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={
              variant === "destructive"
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : ""
            }
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Procesando…
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
