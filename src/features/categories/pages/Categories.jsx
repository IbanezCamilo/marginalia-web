import { useState } from "react";
import { Folder, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
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
    addCategory,
    requestDeleteCategory,
    handleConfirmDelete,
    loadCategories,
  } = useCategories();

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-80 animate-pulse rounded-md border border-stone-200 bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center text-center">
        <Folder size={40} strokeWidth={1.5} className="text-rose-700" />
        <h1 className="mt-5 font-serif text-4xl text-stone-950">
          No pudimos cargar las categorias
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{error}</p>
        <Button onClick={loadCategories} className="mt-6 bg-stone-950">
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        title="Eliminar esta categoria?"
        description="Esta accion es permanente. Los posts asociados quedaran sin categoria."
        confirmLabel="Si, eliminar"
      />

      <div className="mb-6 rounded-md border border-stone-200 bg-[#fbf8f3] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
              Taxonomia
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-950">
              Categorias
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-500">
                {categories.length}
              </span>
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Gestiona los temas que ordenan el archivo publico del blog.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-stone-950 hover:bg-rose-900"
          >
            <Plus size={16} />
            Nueva Categoria
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
          <Folder size={42} strokeWidth={1.5} className="text-stone-400" />
          <h2 className="mt-5 font-serif text-3xl text-stone-950">
            Aun no hay categorias
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
            Crea una primera categoria para que las publicaciones se puedan
            explorar por tema.
          </p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="mt-6 bg-stone-950 hover:bg-rose-900"
          >
            Crear categoria
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
          <Table className="w-full">
            <TableHeader className="border-b border-stone-200 bg-stone-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Nombre
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Slug
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Creado
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-stone-200">
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
