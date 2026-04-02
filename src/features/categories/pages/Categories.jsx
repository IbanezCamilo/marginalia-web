import { Button } from "@/components/ui/button";
import { useCategories } from "../hooks/useCategories";
import CategoryRow from "../components/CategoryRow";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Categories() {
  const { categories, loading } = useCategories();

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/**Max Width Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Categorias</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona las categorias de tu blog
            </p>
          </div>
          {/**Create Category Button */}
          <Button
            variant="destructive"
            className="cursor-pointer font-semibold [word-spacing:0.2rem]"
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
              </TableRow>
            </TableHeader>
            {/**Table Body */}
            <TableBody className="divide-y divide-gray-200">
              {categories.map((cat) => {
                return <CategoryRow key={cat.id} category={cat} />;
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
