import { categoryService } from "../services/categoryService";
import { useState, useEffect } from "react";

export function useCategories(){
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


  const addCategory = async (category) => {
    const newCategory = await categoryService.create(category);
    setCategories((prev) => [...prev, newCategory]);
  }

  return{categories, addCategory, loading}
}