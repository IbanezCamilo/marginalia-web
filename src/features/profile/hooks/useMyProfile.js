import { useState, useEffect } from "react";
import { userService } from "@/features/profile/services/userService";
import { toast } from "sonner";

export function useMyProfile(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  //   Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      //call service
      const data = await userService.getProfile();

      // Mapping backend response
      const mappedUser = {
        id: data.userId,
        name: data.name,
        role: data.role,
        email: data.email,
        description: data.description || "",
        image: data.image ?? null,
      };
      setUser(mappedUser);
    } catch (err) {
      setError("Error al cargar el perfil: " + err.message);
      throw err; // Re-throw to allow further handling if needed
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpdate = async (imageFile) => {
    const response = await userService.uploadProfileImage(imageFile);
    setUser((prev) => ({ ...prev, image: response.imageUrl }));
    toast.success("Imagen actualizada correctamente");
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    await userService.deleteProfileImage();
    await loadProfile();
    toast.success("Foto de perfil eliminada");
  };

  // Handle data update
  const handleDataUpdate = async (updatedData) => {
    try {
      const updatedUser = await userService.updateProfile(updatedData);

      setUser((prev) => ({
        ...prev,
        name: updatedUser.name,
        description: updatedUser.description || "",
      }));
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      setError("Error al editar usuario");
      throw error; // Re-throw to allow further handling if needed
    }
  };

  return {
    user,
    loading,
    error,
    loadProfile,
    handleImageUpdate,
    handleImageDelete,
    handleDataUpdate
  }
}