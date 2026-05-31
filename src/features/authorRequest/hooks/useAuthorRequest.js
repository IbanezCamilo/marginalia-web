import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authorRequestService } from "@/features/authorRequest/services/authorRequestService";

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
    } catch (err) {
      toast.error("No se pudo cargar el estado de tu solicitud.");
      console.error(err);
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
      let msg = "No se pudo enviar la solicitud.";
      try {
        const parsed = JSON.parse(err.message);
        msg = parsed.message || parsed.error || msg;
      } catch {
        if (err.message && !err.message.startsWith("Request failed")) msg = err.message;
      }
      toast.error(msg);
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
