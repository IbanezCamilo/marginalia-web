export const POST_STATUS_CONFIG = {
  PUBLISHED: { label: "Publicado", badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  DRAFT:     { label: "Borrador",  badgeClass: "border-amber-200 bg-amber-50 text-amber-700" },
  REJECTED:  { label: "Rechazado", badgeClass: "border-rose-200 bg-rose-50 text-rose-700" },
  ARCHIVED:  { label: "Archivado", badgeClass: "border-stone-300 bg-stone-100 text-stone-600" },
};

export function getPostStatusConfig(status) {
  return (
    POST_STATUS_CONFIG[status] ?? {
      label: status,
      badgeClass: "border-stone-200 bg-stone-100 text-stone-600",
    }
  );
}
