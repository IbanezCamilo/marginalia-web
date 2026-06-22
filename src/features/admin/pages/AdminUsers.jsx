import { Plus, Search, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import CreateUserDialog from "@/features/admin/components/CreateUserDialog";
import EditUserDialog from "@/features/admin/components/EditUserDialog";
import UserRow from "@/features/admin/components/UserRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLE_TABS = [
  { value: null, label: "Todos" },
  { value: "ADMIN", label: "Administradores" },
  { value: "AUTHOR", label: "Autores" },
  { value: "MODERATOR", label: "Moderadores" },
  { value: "READER", label: "Lectores" },
];

export default function AdminUsers() {
  const { state: { user: currentUser } } = useAuth();
  const {
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
    confirmDeleteUserName,
    requestDelete,
    closeDelete,
    confirmDelete,
  } = useAdminUsers();

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="h-80 animate-pulse rounded-md border border-border bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={UserCog}
        title="No pudimos cargar los usuarios"
        message={error}
        onRetry={() => load(0)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <CreateUserDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={submitCreate}
      />

      <EditUserDialog
        isOpen={editState.open}
        user={editState.user}
        onClose={closeEdit}
        onSave={submitEdit}
      />

      <ConfirmDialog
        open={confirmDeleteState.open}
        onOpenChange={(open) => !open && closeDelete()}
        title="¿Eliminar este usuario?"
        description={
          confirmDeleteUserName
            ? `Esta acción eliminará a "${confirmDeleteUserName}" de forma permanente y revocará su acceso a la plataforma.`
            : "Esta acción es permanente y revocará el acceso de la cuenta a la plataforma."
        }
        confirmLabel="Si, eliminar"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      {/* Header */}
      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Administración
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Usuarios
              <span className="ml-3 inline-flex translate-y-[-0.25rem] items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {totalElements}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestiona las cuentas y roles de la plataforma.
            </p>
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-rose-700 hover:bg-rose-800"
          >
            <Plus size={16} />
            Nuevo usuario
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => changeSearch(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="border-border bg-card pl-9 placeholder:text-muted-foreground focus-visible:border-stone-400 focus-visible:ring-stone-400/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => (
            <Button
              key={tab.label}
              size="sm"
              onClick={() => changeRoleFilter(tab.value)}
              className={
                roleFilter === tab.value && !searchInput
                  ? "bg-stone-950 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300"
                  : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {users.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No se encontraron usuarios"
          description="Ajusta la búsqueda o el filtro de rol para encontrar lo que buscas."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
            <Table className="w-full">
              <TableHeader className="border-b border-border bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Nombre
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Rol
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Creado
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={() => openEdit(user)}
                    onDelete={() => requestDelete(user.id)}
                    disableDelete={user.id === currentUser?.id}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => load(currentPage - 1)}
                  className="border-border"
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => load(currentPage + 1)}
                  className="border-border"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
