import { TableCell, TableRow } from "@/components/ui/table";
import CategoryRowActions from "./CategoryRowActions";

const INITIAL_COLORS = [
  "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900",
  "bg-sky-50 text-sky-800 border-sky-100 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-900",
  "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  "bg-violet-50 text-violet-800 border-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900",
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
    <TableRow className="transition-colors hover:bg-surface-warm">
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${colorClass}`}
          >
            {category.name.charAt(0).toUpperCase()}
          </span>
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4">
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          <span className="text-muted-foreground">/</span>
          {category.slug}
        </span>
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
        {formattedDate}
      </TableCell>

      <TableCell className="px-6 py-4">
        <CategoryRowActions onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}
