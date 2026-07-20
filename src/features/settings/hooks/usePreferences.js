import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { preferencesService } from "@/features/settings/services/preferencesService";
import { getErrorMessage } from "@/lib/apiError";

export function usePreferences() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPreferences(await preferencesService.getPreferences());
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar tus preferencias."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (key) => {
      if (!preferences || saving) return;
      const previous = preferences[key];
      const next = previous === "true" ? "false" : "true";

      // Optimistic flip; the server's resolved map is authoritative on success.
      setPreferences((prev) => ({ ...prev, [key]: next }));
      setSaving(true);
      try {
        const resolved = await preferencesService.updatePreferences({ [key]: next });
        setPreferences(resolved);
      } catch (err) {
        setPreferences((prev) => ({ ...prev, [key]: previous }));
        toast.error(getErrorMessage(err, "No se pudo guardar tu preferencia."));
      } finally {
        setSaving(false);
      }
    },
    [preferences, saving],
  );

  return { preferences, loading, saving, error, reload: load, toggle };
}
