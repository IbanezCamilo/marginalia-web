import { useState, useEffect, useRef } from "react";
import { userService } from "@/features/profile/services/userService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

export function useMyProfile(){
    const { actions: { refreshUser } } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const deletingRef = useRef(false);

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
      setError(getErrorMessage(err, "No se pudo cargar el perfil."));
      throw err; // Re-throw to allow further handling if needed
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpdate = async (imageFile) => {
    const response = await userService.uploadProfileImage(imageFile);
    setUser((prev) => ({ ...prev, image: response.imageUrl }));
    refreshUser();
    toast.success("Imagen actualizada correctamente");
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      await userService.deleteProfileImage();
      await loadProfile();
      refreshUser();
      toast.success("Foto de perfil eliminada");
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
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
      refreshUser();
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo editar el perfil."));
      throw error; // Re-throw to allow further handling if needed
    }
  };

  return {
    user,
    loading,
    error,
    deleting,
    loadProfile,
    handleImageUpdate,
    handleImageDelete,
    handleDataUpdate
  }
}