import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authorRequestService } from "@/features/authorRequest/services/authorRequestService";
import { ApiError, getErrorMessage } from "@/lib/apiError";

export function useAuthorRequest() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [active, historyData] = await Promise.all([
        authorRequestService.getActive().catch((err) => {
          if (err instanceof ApiError && err.status === 404) return null;
          throw err;
        }),
        authorRequestService.getHistory(0, 10),
      ]);
      setActiveRequest(active);
      setHistory((historyData.content ?? []).filter((r) => r.id !== active?.id));
    } catch {
      toast.error("No se pudo cargar el estado de tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async () => {
    setSubmitting(true);
    try {
      await authorRequestService.submit(motivation.trim() || null);
      setMotivation("");
      toast.success("¡Solicitud enviada! Revisaremos tu solicitud pronto.");
      setLoading(true);
      await loadData();
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
