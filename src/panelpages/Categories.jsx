import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/data/categoryService";
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await categoryService.getAll();
      setCategories(data);
      setLoading(false);
    };

    loadCategories();
  }, []);

  const CategoryRow = ({ category }) => {
    const formattedDate = category.createdAt
      ? new Date(category.createdAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

    return (
      <TableRow>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell>{category.createdAt}</TableCell>
      </TableRow>
    );
  };

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
