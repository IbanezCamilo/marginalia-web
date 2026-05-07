import { TableCell, TableRow } from "@/components/ui/table";
import CategoryRowActions from "./CategoryRowActions";

const INITIAL_COLORS = [
  "bg-rose-100 text-rose-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-purple-100 text-purple-800",
];

export default function CategoryRow({ category, onDelete }) {
  const formattedDate = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const colorClass =
    INITIAL_COLORS[category.name.charCodeAt(0) % INITIAL_COLORS.length];

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center
                           text-xs font-medium flex-shrink-0 ${colorClass}`}
          >
            {category.name.charAt(0).toUpperCase()}
          </span>
          <span className="font-medium text-gray-900">{category.name}</span>
        </div>
      </TableCell>

      <TableCell>
        <span
          className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200
                         rounded-md px-2 py-0.5 font-mono text-xs text-gray-500"
        >
          <span className="text-gray-400">/</span>
          {category.slug}
        </span>
      </TableCell>

      <TableCell className="text-sm text-gray-400">{formattedDate}</TableCell>

      <TableCell>
        <CategoryRowActions onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}
