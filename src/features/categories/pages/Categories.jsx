import { useState } from "react";
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
    confirmState,
    setConfirmState,
    addCategory,
    requestDeleteCategory,
    handleConfirmDelete,
  } = useCategories();

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar esta categoría?"
        description="Esta acción es permanente. Los posts asociados quedarán sin categoría."
        confirmLabel="Sí, eliminar"
      />

      {/**Max Width Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Categorías
              <span
                className="ml-2 inline-flex items-center bg-gray-100 border border-gray-200
                   rounded-full px-2 py-0.5 text-xs font-normal text-gray-500"
              >
                {categories.length}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona las categorias de tu blog
            </p>
          </div>
          {/**Create Category Button */}
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="cursor-pointer font-semibold [word-spacing:0.2rem]"
            variant="destructive"
          >
            + Nueva Categoría
          </Button>
        </div>

        {/**Categories Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table className="w-full">
            {/**Table Headers */}
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </TableHead>
                <TableHead className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></TableHead>
              </TableRow>
            </TableHeader>
            {/**Table Body */}
            <TableBody className="divide-y divide-gray-200">
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

        <CreateCategoryDialog
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={addCategory}
        />
      </div>
    </div>
  );
}
