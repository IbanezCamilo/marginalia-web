import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService";
import { getErrorMessage } from "@/lib/apiError";

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
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
      setCurrentPage(page);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar las solicitudes."));
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

  const openResolve = async (type, requestId) => {
    // Claim the request first so other admins see "En revisión" before we act;
    // a 409 means someone else got there first — surface who and refresh the list.
    try {
      await adminAuthorRequestService.claim(requestId);
      setResolveState({ open: true, type, requestId, adminNote: "" });
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo reservar la solicitud."));
      await load(currentPage, statusFilter);
    }
  };

  const closeResolve = () => {
    // Cancel path: release the claim explicitly instead of letting it expire.
    // Fire-and-forget — a failed release only means the claim expires by TTL.
    if (resolveState.requestId != null) {
      adminAuthorRequestService.release(resolveState.requestId).catch(() => {});
    }
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
      // Resolution already cleared the claim server-side — no release needed.
      setResolveState(INITIAL_RESOLVE);
      await load(currentPage, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo procesar la solicitud."));
      // A 409 here means a stale version or a stolen claim — refresh so the
      // table shows the real state (badge or final resolution).
      await load(currentPage, statusFilter);
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
