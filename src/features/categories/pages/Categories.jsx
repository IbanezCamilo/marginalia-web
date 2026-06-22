import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
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

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-80 animate-pulse rounded-md border border-border bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={Folder}
        title="No pudimos cargar las categorias"
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
        title="¿Eliminar esta categoria?"
        description={
          confirmDeleteCategoryName
            ? `Esta acción eliminará "${confirmDeleteCategoryName}" de forma permanente. Los posts asociados quedarán sin categoría.`
            : "Esta accion es permanente. Los posts asociados quedaran sin categoria."
        }
        confirmLabel="Si, eliminar"
      />

      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Taxonomia
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Categorias
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {categories.length}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestiona los temas que ordenan el archivo publico del blog.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-rose-700 hover:bg-rose-800"
          >
            <Plus size={16} />
            Nueva Categoria
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Aun no hay categorias"
          description="Crea una primera categoria para que las publicaciones se puedan explorar por tema."
          action={{ label: "Crear categoria", onClick: () => setCreateModalOpen(true) }}
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
