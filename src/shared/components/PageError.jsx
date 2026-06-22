import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Page-level error state. `tone="admin"` matches the authenticated panel
 * (shadcn Button, design tokens); `tone="public"` matches the reading
 * surfaces (raw stone-950 CTA, optional secondary link back home).
 */
export function PageError({
  icon,
  title,
  message,
  onRetry,
  retryLabel = "Reintentar",
  secondaryAction,
  tone = "admin",
  as = "h1",
  className = "",
}) {
  const Icon = icon;
  const As = as;
  const isPublic = tone === "public";

  return (
    <div
      className={cn(
        "mx-auto flex flex-col items-center justify-center text-center",
        isPublic ? "min-h-[60vh] max-w-3xl px-5" : "min-h-[50vh] max-w-2xl",
        className,
      )}
    >
      <Icon size={42} strokeWidth={1.5} className="text-destructive" aria-hidden="true" />
      <As
        className={
          isPublic
            ? "mt-6 font-serif text-4xl text-stone-950 dark:text-stone-50"
            : "mt-5 font-serif text-4xl text-foreground"
        }
      >
        {title}
      </As>
      <p
        className={
          isPublic
            ? "mt-4 max-w-xl text-stone-600 dark:text-stone-400"
            : "mt-3 text-sm leading-6 text-muted-foreground"
        }
      >
        {message}
      </p>

      {(onRetry || secondaryAction) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRetry &&
            (isPublic ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
              >
                <RefreshCw size={16} aria-hidden="true" />
                {retryLabel}
              </button>
            ) : (
              <Button onClick={onRetry} className="bg-rose-700 hover:bg-rose-800">
                <RefreshCw size={16} />
                {retryLabel}
              </Button>
            ))}
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="inline-flex h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
