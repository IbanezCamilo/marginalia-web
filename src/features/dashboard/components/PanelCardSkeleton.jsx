function PanelCardSkeleton({ type = "default" }) {
  return (
    <div className="animate-pulse rounded-md border border-border bg-card p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <div className="mb-5 h-4 w-1/2 rounded bg-muted"></div>

      {type === "stats" && (
        <div className="mt-6 h-10 w-20 rounded bg-muted"></div>
      )}

      {type === "list" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-2/3 rounded bg-muted"></div>
            <div className="h-4 w-20 rounded bg-muted"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/2 rounded bg-muted"></div>
            <div className="h-4 w-16 rounded bg-muted"></div>
          </div>
        </div>
      )}

      {type === "actions" && (
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-32 rounded-md bg-muted"></div>
          <div className="h-10 w-32 rounded-md bg-muted"></div>
        </div>
      )}

      {type === "default" && (
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-4/5 rounded bg-muted"></div>
        </div>
      )}
    </div>
  );
}

export { PanelCardSkeleton };
