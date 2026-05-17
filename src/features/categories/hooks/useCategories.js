import { categoryService } from "../services/categoryService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useCategories(){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmState, setConfirmState] = useState({
      open: false,
      categoryId: null,
  });

  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Error al cargar las categorias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category) => {
    const newCategory = await categoryService.create(category);
    setCategories((prev) => [...prev, newCategory]);
  }

  const requestDeleteCategory = (id) => {
    setConfirmState({open: true, categoryId: id});
  }

  const handleConfirmDelete = async () => {
    const { categoryId } = confirmState;
    setConfirmState((prev) => ({ ...prev, open: false }));

      try {
        await categoryService.delete(categoryId);
        setCategories((prev) => prev.filter((c) => c.id != categoryId));
        toast.success("Categoria eliminada correctamente");
      } catch {
        toast.error("Error al eliminar la categoria");
      }
      return; // If it's a delete action, we don't need to continue to toggle status logic
  }
  return{categories, loading, error, confirmState, setConfirmState, addCategory, requestDeleteCategory, handleConfirmDelete, loadCategories}
}
