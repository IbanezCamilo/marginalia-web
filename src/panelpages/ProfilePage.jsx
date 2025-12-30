// src/panel-components/profile/ProfilePage.jsx

import { useState, useEffect } from "react";
import { FaUserEdit, FaEnvelope, FaUserShield, FaCamera } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProfileImageUpload from "../panel-components/profile/ProfileImageUpload";
import ProfileEditDialog from "../panel-components/profile/ProfileEditDialog";
import { userService } from "../data/userService";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de modals
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Cargar perfil al inicio
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // ← Usa el servicio (mock o real según CONFIG)
      const data = await userService.getProfile();

      // Mapear respuesta del backend a nuestro formato
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

  // Manejar subida de imagen
  const handleImageUpdate = async (file) => {
    const response = await userService.uploadProfileImage(file);

    const imageUrl = response.image.startsWith("http")
      ? response.image
      : `http://localhost:8080${response.image}`;

    setUser((prev) => ({ ...prev, image: imageUrl }));
    alert("Imagen actualizada correctamente ✓");
  };

  // Manejar actualización de datos
  const handleDataUpdate = async (updatedData) => {
    try {
      console.log(
        "Datos recibidos en ProfilePage: " +
          "nombre: " +
          updatedData.name +
          " descripcion: " +
          updatedData.description
      );

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

  // Estados de carga
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadProfile} variant="destructive">
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6 shadow-md rounded-2xl border border-gray-200">
        <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Foto de perfil - Click para editar */}
          <div
            className="relative group cursor-pointer"
            onClick={() => setImageModalOpen(true)}
          >
            <img
              src={user.image}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-sm object-cover transition-opacity group-hover:opacity-75 pointer-events-none"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-opacity-40 rounded-full transition-all">
              <FaCamera className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <div className="flex justify-center md:justify-start items-center gap-2 text-gray-500">
              <FaUserShield />
              <span>{user.role}</span>
            </div>
            <div className="flex justify-center md:justify-start items-center gap-2 text-gray-500">
              <FaEnvelope />
              <span>{user.email}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              {user.description || "Sin descripción"}
            </p>

            <div className="flex justify-center md:justify-start mt-4">
              <Button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer hover:bg-rose-500"
                variant="destructive"
              >
                <FaUserEdit /> Editar perfil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para cambiar imagen */}
      <ProfileImageUpload
        currentImage={user.image}
        onImageUpdated={handleImageUpdate}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />

      {/* Modal para editar datos */}
      <ProfileEditDialog
        user={user}
        onSave={handleDataUpdate}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
