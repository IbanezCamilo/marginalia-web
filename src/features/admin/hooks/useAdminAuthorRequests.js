import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService";

const INITIAL_RESOLVE = { open: false, type: null, requestId: null, adminNote: "" };

export function useAdminAuthorRequests() {
  const [requests, setRequests] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolveState, setResolveState] = useState(INITIAL_RESOLVE);
  const [resolving, setResolving] = useState(false);

  const load = useCallback(async (page, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAuthorRequestService.list(status, page);
      setRequests(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setCurrentPage(page);
    } catch (err) {
      setError("No se pudieron cargar las solicitudes: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0, statusFilter);
  }, [load, statusFilter]);

  const changeFilter = (status) => {
    setStatusFilter(status);
    // load is triggered by the useEffect watching statusFilter
  };

  const openResolve = (type, requestId) => {
    setResolveState({ open: true, type, requestId, adminNote: "" });
  };

  const closeResolve = () => {
    setResolveState(INITIAL_RESOLVE);
  };

  const confirmResolve = async () => {
    const { type, requestId, adminNote } = resolveState;
    setResolving(true);
    try {
      if (type === "approve") {
        await adminAuthorRequestService.approve(requestId, adminNote);
        toast.success("Solicitud aprobada. El usuario ahora es autor.");
      } else {
        await adminAuthorRequestService.reject(requestId, adminNote);
        toast.success("Solicitud rechazada.");
      }
      closeResolve();
      await load(currentPage, statusFilter);
    } catch (err) {
      let msg = "No se pudo procesar la solicitud.";
      try {
        const parsed = JSON.parse(err.message);
        msg = parsed.message || parsed.error || msg;
      } catch {
        if (err.message && !err.message.startsWith("Request failed")) msg = err.message;
      }
      toast.error(msg);
    } finally {
      setResolving(false);
    }
  };

  return {
    requests,
    totalElements,
    totalPages,
    currentPage,
    statusFilter,
    loading,
    error,
    resolveState,
    resolving,
    load,
    changeFilter,
    openResolve,
    closeResolve,
    confirmResolve,
    setResolveState,
  };
}
