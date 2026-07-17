import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "../hooks/useCategories";
import CreateCategoryDialog from "../components/CreateCategory";
import CategoryRow from "../components/CategoryRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_COLUMNS = [
  { label: "Nombre", barClass: "h-4 w-32" },
  { label: "Slug", barClass: "h-5 w-24 rounded-full" },
  { label: "Creado", barClass: "h-4 w-20" },
  { label: "", barClass: "h-8 w-8" },
];

export default function Categories() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const {
    categories,
    loading,
    error,
    confirmState,
    setConfirmState,
    confirmDeleteCategoryName,
    addCategory,
    requestDeleteCategory,
    handleConfirmDelete,
    loadCategories,
  } = useCategories();

  if (error) {
    return (
      <PageError
        icon={Folder}
        title="No pudimos cargar las categorías"
        message={error}
        onRetry={loadCategories}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar esta categoría?"
        description={
          confirmDeleteCategoryName
            ? `Esta acción eliminará "${confirmDeleteCategoryName}" de forma permanente. Los posts asociados quedarán sin categoría.`
            : "Esta acción es permanente. Los posts asociados quedarán sin categoría."
        }
        confirmLabel="Sí, eliminar"
      />

      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Taxonomía
</p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Categorías
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {loading ? <Skeleton className="h-4 w-5 rounded-full" /> : categories.length}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestiona los temas que ordenan el archivo público del blog.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-rose-700 hover:bg-rose-800"
          >
            <Plus size={16} />
            Nueva Categoría
          </Button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={SKELETON_COLUMNS} rows={6} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Aún no hay categorías"
          description="Crea una primera categoría para que las publicaciones se puedan explorar por tema."
          action={{ label: "Crear categoría", onClick: () => setCreateModalOpen(true) }}
        />
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
          <Table className="w-full">
            <TableHeader className="border-b border-border bg-muted">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Nombre
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Slug
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Creado
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onDelete={() => requestDeleteCategory(cat.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateCategoryDialog
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={addCategory}
      />
    </div>
  );
}
