import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { adminUserService } from "@/features/admin/services/adminUserService";

const INITIAL_EDIT = { open: false, user: null };
const INITIAL_DELETE = { open: false, userId: null };

const parseErrorMessage = (err, fallback) => {
  try {
    const parsed = JSON.parse(err.message);
    return parsed.message || parsed.error || fallback;
  } catch {
    if (err.message && !err.message.startsWith("Request failed")) return err.message;
    return fallback;
  }
};

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editState, setEditState] = useState(INITIAL_EDIT);
  const [confirmDeleteState, setConfirmDeleteState] = useState(INITIAL_DELETE);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (debouncedSearch) {
        data = await adminUserService.search(debouncedSearch, page);
      } else if (roleFilter) {
        data = await adminUserService.byRole(roleFilter, page);
      } else {
        data = await adminUserService.list(page);
      }
      setUsers(data.content ?? []);
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
      setCurrentPage(page);
    } catch (err) {
      setError("No se pudieron cargar los usuarios: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    load(0);
  }, [load]);

  const changeSearch = (value) => {
    setSearchInput(value);
    if (value.trim()) setRoleFilter(null);
  };

  const changeRoleFilter = (role) => {
    setRoleFilter(role);
    setSearchInput("");
    setDebouncedSearch("");
  };

  // Create
  const submitCreate = async (data) => {
    await adminUserService.create(data);
    toast.success("Usuario creado correctamente.");
    setCreateOpen(false);
    await load(0);
  };

  // Edit
  const openEdit = (user) => setEditState({ open: true, user });
  const closeEdit = () => setEditState(INITIAL_EDIT);

  const submitEdit = async (id, data) => {
    const updated = await adminUserService.update(id, data);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    toast.success("Usuario actualizado correctamente.");
    closeEdit();
  };

  // Delete
  const requestDelete = (userId) => setConfirmDeleteState({ open: true, userId });
  const closeDelete = () => setConfirmDeleteState(INITIAL_DELETE);

  const confirmDelete = async () => {
    const { userId } = confirmDeleteState;
    closeDelete();
    try {
      await adminUserService.remove(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalElements((prev) => prev - 1);
      toast.success("Usuario eliminado correctamente.");
    } catch (err) {
      toast.error(parseErrorMessage(err, "No se pudo eliminar el usuario."));
    }
  };

  return {
    users,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    searchInput,
    roleFilter,
    load,
    changeSearch,
    changeRoleFilter,
    createOpen,
    setCreateOpen,
    submitCreate,
    editState,
    openEdit,
    closeEdit,
    submitEdit,
    confirmDeleteState,
    requestDelete,
    closeDelete,
    confirmDelete,
    parseErrorMessage,
  };
}
