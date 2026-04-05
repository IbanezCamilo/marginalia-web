import { TableCell, TableRow } from "@/components/ui/table";

export default function CategoryRow({ category }) {
  const formattedDate = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <TableRow>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.slug}</TableCell>
      <TableCell>{formattedDate}</TableCell>
    </TableRow>
  );
}
