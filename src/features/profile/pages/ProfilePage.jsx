import { useState } from "react";
import { BookOpen, Camera, KeyRound, Mail, PenLine, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageError } from "@/shared/components/PageError";
import ProfileImageUpload from "../components/ProfileImageUpload";
import ProfileEditDialog from "../components/ProfileEditDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import { useMyProfile } from "../hooks/useMyProfile";

const ROLE_LABELS = {
  ADMIN: "Administrador",
  AUTHOR: "Autor",
  USER: "Lector",
};

export default function ProfilePage() {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const { user, loading, error, deleting, loadProfile, handleImageUpdate, handleImageDelete, handleDataUpdate } =
    useMyProfile();

  const handleImageDeleteAndClose = async () => {
    await handleImageDelete();
    setImageModalOpen(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="animate-pulse rounded-md border border-border bg-surface-warm p-6 sm:p-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="mx-auto size-32 shrink-0 rounded-full bg-muted sm:mx-0" />
            <div className="flex-1 space-y-4">
              <div className="mx-auto h-3 w-24 rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-10 w-64 rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-3 w-48 rounded bg-muted sm:mx-0" />
              <div className="mt-2 h-20 w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={BookOpen}
        title="No pudimos cargar el perfil"
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  if (!user) return null;

  const roleLabel = ROLE_LABELS[user.role] ?? user.role;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-md border border-border bg-surface-warm p-6 sm:p-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            className="group relative mx-auto shrink-0 sm:mx-0"
            aria-label="Cambiar foto de perfil"
          >
            <img
              src={user.image}
              alt={user.name}
              className="size-32 rounded-full border-4 border-card object-cover shadow-md transition duration-300 group-hover:brightness-75"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={22} className="text-white drop-shadow-md" />
            </span>
          </button>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Perfil de autor
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
              {user.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Shield size={13} strokeWidth={1.8} />
                {roleLabel}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail size={13} strokeWidth={1.8} />
                {user.email}
              </span>
            </div>

            {user.description ? (
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                {user.description}
              </p>
            ) : (
              <p className="mt-5 text-sm italic text-muted-foreground">
                Aún no has añadido una presentación como autor.
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Button
                onClick={() => setEditModalOpen(true)}
                variant="outline"
                className="border-border bg-transparent"
              >
                <PenLine size={15} />
                Editar perfil
              </Button>
              <Button
                onClick={() => setPasswordModalOpen(true)}
                variant="outline"
                className="border-border bg-transparent"
              >
                <KeyRound size={15} />
                Cambiar contraseña
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProfileImageUpload
        currentImage={user.image}
        onImageUpdated={handleImageUpdate}
        onImageDeleted={user.image ? handleImageDeleteAndClose : undefined}
        isDeleting={deleting}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
      <ProfileEditDialog
        user={user}
        onSave={handleDataUpdate}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <ChangePasswordDialog
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
