import { useState, useEffect } from "react";
import { userService } from "@/data/userService";

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
        image:
          data.image ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",
      };
      setUser(mappedUser);
    } catch (err) {
      setError("Error al cargar el perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpdate = async (imageFile) => {
    const response = await userService.uploadProfileImage(imageFile);
    const imageUrl = response.imageUrl.startsWith("http")
      ? response.imageUrl
      : `http://localhost:8080${response.imageUrl}`;

    setUser((prev) => ({ ...prev, image: imageUrl }));
    alert("Imagen actualizada correctamente ✓");
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
      alert("Perfil actualizado correctamente");
    } catch (error) {
      setError("Error al editar usuario");
    }
  };

  return {
    user,
    loading,
    error,
    loadProfile,
    handleImageUpdate,
    handleDataUpdate
  }
}