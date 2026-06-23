import { PanelCard } from "../components/PanelCard";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, helper, icon, attention = false }) {
  const Icon = icon;

  return (
    <PanelCard
      className={cn(
        "min-h-36",
        attention && "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 font-serif text-4xl text-foreground">{value}</p>
        </div>
        <span
          className={cn(
            "grid size-10 place-items-center rounded-md border",
            attention
              ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/60 dark:text-amber-400"
              : "border-border bg-muted text-rose-800 dark:text-rose-400",
          )}
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
      {helper && <p className="mt-4 text-sm text-muted-foreground">{helper}</p>}
    </PanelCard>
  );
}
