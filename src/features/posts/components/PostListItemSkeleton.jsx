import { Skeleton } from "@/components/ui/skeleton";

// Loading placeholder mirroring PostListItemCard: cover image + text column.
export default function PostListItemSkeleton() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-0 rounded-md border border-border bg-card p-3 shadow-[0_1px_2px_rgba(28,25,23,0.04)] md:flex-row">
      <Skeleton className="aspect-video w-full shrink-0 md:w-52" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
    </div>
  );
}
