import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCENT = {
  rose: {
    eyebrow: "text-rose-700 dark:text-rose-400",
    primaryButton: "bg-rose-700 hover:bg-rose-800",
  },
  violet: {
    eyebrow: "text-violet-700 dark:text-violet-400",
    primaryButton: "bg-violet-700 hover:bg-violet-800",
  },
};

export function DashboardHero({ eyebrow, title, description, accent = "rose", actions = [] }) {
  const tone = ACCENT[accent] ?? ACCENT.rose;

  return (
    <section className="rounded-md border border-border bg-surface-warm p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.24em]", tone.eyebrow)}>
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              const isPrimary = action.variant !== "outline";
              const iconPosition = action.iconPosition ?? (isPrimary ? "start" : "end");

              return (
                <Button
                  key={action.label}
                  asChild
                  variant={isPrimary ? "default" : "outline"}
                  className={isPrimary ? tone.primaryButton : "border-border bg-transparent"}
                >
                  <Link to={action.to}>
                    {iconPosition === "start" && ActionIcon && <ActionIcon size={16} />}
                    {action.label}
                    {iconPosition === "end" && ActionIcon && <ActionIcon size={16} />}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
