export const POST_STATUS_CONFIG = {
  PUBLISHED: { label: "Publicado", badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400" },
  DRAFT:     { label: "Borrador",  badgeClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400" },
  REJECTED:  { label: "Rechazado", badgeClass: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400" },
  ARCHIVED:  { label: "Archivado", badgeClass: "border-border bg-muted text-muted-foreground" },
};

export function getPostStatusConfig(status) {
  return (
    POST_STATUS_CONFIG[status] ?? {
      label: status,
      badgeClass: "border-border bg-muted text-muted-foreground",
    }
  );
}
