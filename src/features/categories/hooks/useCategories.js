import { categoryService } from "../services/categoryService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

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
      setError(getErrorMessage(err, "No se pudieron cargar las categorías."));
    } finally {
      setLoading(false);
    }
  };

  // No try/catch here by design — the only caller (useCreateCategory.handleSave)
  // already wraps this and shows the error toast; a future direct caller must
  // handle the rejection itself rather than have it silently swallowed.
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
      } catch (err) {
        toast.error(getErrorMessage(err, "Error al eliminar la categoria"));
      }
      return; // If it's a delete action, we don't need to continue to toggle status logic
  }
  return{categories, loading, error, confirmState, setConfirmState, addCategory, requestDeleteCategory, handleConfirmDelete, loadCategories}
}
