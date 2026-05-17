import { TableCell, TableRow } from "@/components/ui/table";
import CategoryRowActions from "./CategoryRowActions";

const INITIAL_COLORS = [
  "bg-rose-50 text-rose-800 border-rose-100",
  "bg-sky-50 text-sky-800 border-sky-100",
  "bg-emerald-50 text-emerald-800 border-emerald-100",
  "bg-amber-50 text-amber-800 border-amber-100",
  "bg-violet-50 text-violet-800 border-violet-100",
];

export default function CategoryRow({ category, onDelete }) {
  const formattedDate = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const colorClass =
    INITIAL_COLORS[category.name.charCodeAt(0) % INITIAL_COLORS.length];

  return (
    <TableRow className="transition-colors hover:bg-[#fbf8f3]">
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${colorClass}`}
          >
            {category.name.charAt(0).toUpperCase()}
          </span>
          <span className="font-medium text-stone-900">{category.name}</span>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">
        <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-xs text-stone-500">
          <span className="text-stone-400">/</span>
          {category.slug}
        </span>
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-stone-500">
        {formattedDate}
      </TableCell>

      <TableCell className="px-6 py-4">
        <CategoryRowActions onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}
