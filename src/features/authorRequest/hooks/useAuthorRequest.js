import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authorRequestService } from "@/features/authorRequest/services/authorRequestService";
import { getErrorMessage } from "@/lib/apiError";

export function useAuthorRequest() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadHistory = async () => {
    try {
      const data = await authorRequestService.getHistory(0, 10);
      const all = data.content ?? [];
      setActiveRequest(all[0] ?? null);
      setHistory(all.slice(1));
    } catch {
      toast.error("No se pudo cargar el estado de tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await authorRequestService.getHistory(0, 10);
        if (cancelled) return;
        const all = data.content ?? [];
        setActiveRequest(all[0] ?? null);
        setHistory(all.slice(1));
      } catch {
        if (!cancelled) toast.error("No se pudo cargar el estado de tu solicitud.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const submit = async () => {
    setSubmitting(true);
    try {
      await authorRequestService.submit(motivation.trim() || null);
      setMotivation("");
      toast.success("¡Solicitud enviada! Revisaremos tu solicitud pronto.");
      setLoading(true);
      await loadHistory();
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo enviar la solicitud."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activeRequest,
    history,
    motivation,
    setMotivation,
    loading,
    submitting,
    submit,
  };
}
