import { TableCell, TableRow } from "@/components/ui/table";
import UserRowActions from "./UserRowActions";

const ROLE_BADGE = {
  ADMIN: "border-rose-200 bg-rose-50 text-rose-700",
  MODERATOR: "border-amber-200 bg-amber-50 text-amber-700",
  AUTHOR: "border-sky-200 bg-sky-50 text-sky-700",
  READER: "border-stone-200 bg-stone-100 text-stone-600",
};

const ROLE_LABEL = {
  ADMIN: "Administrador",
  MODERATOR: "Moderador",
  AUTHOR: "Autor",
  READER: "Lector",
};

export default function UserRow({ user, onEdit, onDelete, disableDelete }) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const roleName = user.role?.name;

  return (
    <TableRow className="transition-colors hover:bg-[#fbf8f3]">
      <TableCell className="px-6 py-4 font-medium text-stone-950">{user.name}</TableCell>
      <TableCell className="px-6 py-4 text-sm text-stone-600">{user.email}</TableCell>
      <TableCell className="px-6 py-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ROLE_BADGE[roleName] ?? "border-stone-200 bg-stone-100 text-stone-600"}`}
        >
          {ROLE_LABEL[roleName] ?? roleName}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-sm text-stone-500">{formattedDate}</TableCell>
      <TableCell className="px-6 py-4">
        <UserRowActions onEdit={onEdit} onDelete={onDelete} disableDelete={disableDelete} />
      </TableCell>
    </TableRow>
  );
}
