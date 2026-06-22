import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Deliberate empty-state block: icon + heading + description + optional CTA.
 * `variant="card"` (default) is the dashed-border admin/table treatment;
 * `variant="plain"` drops the border for hero/inline placements.
 */
export function EmptyState({
  icon,
  iconSize = 42,
  title,
  description,
  action,
  variant = "card",
  headingClassName = "text-3xl",
  headingAs = "h2",
  className = "",
}) {
  const Icon = icon;
  const Heading = headingAs;
  const containerClassName =
    variant === "card"
      ? "flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-border bg-card p-8 text-center"
      : "flex flex-col items-center justify-center py-10 text-center";

  return (
    <div className={cn(containerClassName, className)}>
      <Icon size={iconSize} strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
      <Heading className={cn("mt-5 font-serif text-foreground", headingClassName)}>{title}</Heading>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {action &&
        (action.to ? (
          <Button asChild className="mt-6 bg-rose-700 hover:bg-rose-800">
            <Link to={action.to}>
              {action.label}
              {action.icon ? <action.icon size={16} /> : null}
            </Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} className="mt-6 bg-rose-700 hover:bg-rose-800">
            {action.label}
          </Button>
        ))}
    </div>
  );
}
