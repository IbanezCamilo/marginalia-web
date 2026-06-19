import { cn } from "@/lib/utils";

function PanelCard({ children, className }) {
  return (
    <section
      className={cn(
        "rounded-md border border-border bg-card p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export { PanelCard };
