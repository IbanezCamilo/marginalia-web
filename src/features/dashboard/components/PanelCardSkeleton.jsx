function PanelCardSkeleton({ type = "default" }) {
  return (
    <div className="animate-pulse rounded-md border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <div className="mb-5 h-4 w-1/2 rounded bg-stone-200"></div>

      {type === "stats" && (
        <div className="mt-6 h-10 w-20 rounded bg-stone-300"></div>
      )}

      {type === "list" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-2/3 rounded bg-stone-200"></div>
            <div className="h-4 w-20 rounded bg-stone-200"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/2 rounded bg-stone-200"></div>
            <div className="h-4 w-16 rounded bg-stone-200"></div>
          </div>
        </div>
      )}

      {type === "actions" && (
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-32 rounded-md bg-stone-200"></div>
          <div className="h-10 w-32 rounded-md bg-stone-200"></div>
        </div>
      )}

      {type === "default" && (
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-stone-100"></div>
          <div className="h-4 w-4/5 rounded bg-stone-100"></div>
        </div>
      )}
    </div>
  );
}

export { PanelCardSkeleton };
