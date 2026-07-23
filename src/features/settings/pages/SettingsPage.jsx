import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageError } from "@/shared/components/PageError";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LEVEL } from "@/utils/roles";
import { usePreferences } from "@/features/settings/hooks/usePreferences";
import {
  PREF_POST_MODERATION,
  PREF_SHOW_BIO,
  PREF_SHOW_PHOTO,
} from "@/features/settings/services/preferencesService";

export default function SettingsPage() {
  const {
    state: { user },
  } = useAuth();
  const { preferences, loading, saving, error, reload, toggle } = usePreferences();

  // Sections that don't apply to the user's role are hidden entirely, never
  // rendered disabled. Today READERs have no applicable sections at all.
  const isAuthorOrAbove = (ROLE_LEVEL[user?.role] ?? 0) >= ROLE_LEVEL.AUTHOR;

  if (isAuthorOrAbove && error) {
    return (
      <PageError
        icon={SettingsIcon}
        title="No pudimos cargar tus preferencias"
        message={error}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
          Ajustes
        </p>
        <h1 className="mt-2 font-serif text-4xl text-foreground">Configuración</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Administra tus preferencias de la plataforma.
        </p>
      </div>

      {!isAuthorOrAbove ? (
        <EmptyState
          icon={SettingsIcon}
          title="Aún no hay ajustes disponibles"
          description="Por ahora no hay ajustes disponibles para tu cuenta. Cuando existan, aparecerán aquí."
        />
      ) : loading ? (
        <div className="rounded-md border border-border bg-card p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-4 h-5 w-full max-w-md" />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Notificaciones</h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <Label
                  htmlFor="pref-post-moderation"
                  className="text-sm font-medium text-foreground"
                >
                  Correos de moderación
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recibir un correo cuando el estado de uno de mis posts cambie por moderación.
                </p>
              </div>
              <Switch
                id="pref-post-moderation"
                checked={preferences?.[PREF_POST_MODERATION] === "true"}
                disabled={saving}
                onCheckedChange={() => toggle(PREF_POST_MODERATION)}
              />
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-foreground">Privacidad</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Elige qué información de tu perfil ven los visitantes.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="pref-show-bio" className="text-sm font-medium text-foreground">
                  Mostrar mi biografía
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu biografía aparece en tu perfil público y junto a tus publicaciones.
                </p>
              </div>
              <Switch
                id="pref-show-bio"
                checked={preferences?.[PREF_SHOW_BIO] === "true"}
                disabled={saving}
                onCheckedChange={() => toggle(PREF_SHOW_BIO)}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="pref-show-photo" className="text-sm font-medium text-foreground">
                  Mostrar mi foto de perfil
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Si la ocultas, se mostrará un avatar generado con tus iniciales.
                </p>
              </div>
              <Switch
                id="pref-show-photo"
                checked={preferences?.[PREF_SHOW_PHOTO] === "true"}
                disabled={saving}
                onCheckedChange={() => toggle(PREF_SHOW_PHOTO)}
              />
            </div>

            {/* Always rendered, never conditional on either switch: an author needs the
                caveat before deciding, and the toggle must not promise more than it does
                — ocultar la foto deja de publicar la URL, pero no la revoca. */}
            <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
              Tu nombre siempre es público, porque firma tus publicaciones. Si alguien ya tiene
              el enlace directo a tu foto anterior, podría seguir viéndola.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
