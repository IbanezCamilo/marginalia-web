import { categoryService } from "../services/categoryService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useCategories(){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({
      open: false,
      categoryId: null,
  });

  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
    setLoading(false);
  };

  const addCategory = async (category) => {
    const newCategory = await categoryService.create(category);
    setCategories((prev) => [...prev, newCategory]);
  }

  const requestDeleteCategory = (id) => {
    setConfirmState({open: true, categoryId: id});
  }

  const handleConfirmDelete = async () => {
    const { id } = confirmState;
    setConfirmState((prev) => ({ ...prev, open: false }));

      try {
        await categoryService.delete(id);
        setCategories((prev) => prev.filter((c) => c.id != id));
        toast.success("Categoria eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la categoria");
      }
      return; // If it's a delete action, we don't need to continue to toggle status logic
  }
  return{categories, loading, confirmState, setConfirmState, addCategory, requestDeleteCategory, handleConfirmDelete}
}