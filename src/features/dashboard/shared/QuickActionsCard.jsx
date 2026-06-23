import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "../components/PanelCard";

export function QuickActionsCard({ heading = "Siguiente acción", icon = Sparkles, actions }) {
  const Icon = icon;

  return (
    <PanelCard>
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-400">
          <Icon size={18} />
        </span>
        <h2 className="font-serif text-2xl text-foreground">{heading}</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {actions.map((action) => {
          const ActionIcon = action.icon;
          const isOutline = action.variant === "outline";

          return (
            <Button
              key={action.label}
              asChild
              variant={isOutline ? "outline" : "default"}
              className={isOutline ? "justify-between" : "justify-between bg-rose-700 hover:bg-rose-800"}
            >
              <Link to={action.to}>
                {action.label}
                {ActionIcon && <ActionIcon size={16} />}
              </Link>
            </Button>
          );
        })}
      </div>
    </PanelCard>
  );
}
