import { TableCell, TableRow } from "@/components/ui/table";
import UserRowActions from "./UserRowActions";

const ROLE_BADGE = {
  OWNER: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-400",
  ADMIN: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400",
  MODERATOR: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
  AUTHOR: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400",
  READER: "border-border bg-muted text-muted-foreground",
};

const ROLE_LABEL = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  MODERATOR: "Moderador",
  AUTHOR: "Autor",
  READER: "Lector",
};

export default function UserRow({ user, onEdit, onDelete, disableDelete, disableEdit }) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const roleName = user.role?.name;

  return (
    <TableRow className="transition-colors hover:bg-surface-warm">
      <TableCell className="px-6 py-4 font-medium text-foreground">{user.name}</TableCell>
      <TableCell className="px-6 py-4 text-sm text-muted-foreground">{user.email}</TableCell>
      <TableCell className="px-6 py-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ROLE_BADGE[roleName] ?? "border-border bg-muted text-muted-foreground"}`}
        >
          {ROLE_LABEL[roleName] ?? roleName}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-sm text-muted-foreground">{formattedDate}</TableCell>
      <TableCell className="px-6 py-4">
        <UserRowActions onEdit={onEdit} onDelete={onDelete} disableDelete={disableDelete} disableEdit={disableEdit} />
      </TableCell>
    </TableRow>
  );
}
