import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Loading placeholder that mirrors the admin table shell: real column headers
 * (static text, no data needed) over skeleton body rows.
 *
 * @param {Array<{ label?: string, responsive?: string, barClass?: string }>} columns
 *   One entry per column. `responsive` hides the column at breakpoints
 *   (e.g. "hidden md:table-cell"); `barClass` tunes the skeleton bar size.
 * @param {number} rows  Number of skeleton rows to render.
 */
function TableSkeleton({ columns, rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <Table className="w-full">
        <TableHeader className="border-b border-border bg-muted">
          <TableRow>
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={cn(
                  "px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
                  col.responsive,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {columns.map((col, c) => (
                <TableCell key={c} className={cn("px-6 py-4", col.responsive)}>
                  <Skeleton className={col.barClass ?? "h-4 w-24"} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { TableSkeleton };
