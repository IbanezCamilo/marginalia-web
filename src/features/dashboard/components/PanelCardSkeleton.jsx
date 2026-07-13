import { Skeleton } from "@/components/ui/skeleton";

function PanelCardSkeleton({ type = "default" }) {
  return (
    <div className="rounded-md border border-border bg-card p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <Skeleton className="mb-5 h-4 w-1/2 rounded" />

      {type === "stats" && <Skeleton className="mt-6 h-10 w-20 rounded" />}

      {type === "list" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
      )}

      {type === "actions" && (
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}

      {type === "default" && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
      )}
    </div>
  );
}

export { PanelCardSkeleton };
