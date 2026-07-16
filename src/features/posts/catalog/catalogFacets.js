import { usePublicAuthors } from "@/features/authors/hooks/usePublicAuthors";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";

// Sort labels/keys moved verbatim from PostCatalog.jsx — same keys the API whitelists.
export const SORT_LABELS = {
  featured: "Destacados",
  recent: "Mas recientes",
  oldest: "Mas antiguas",
  title_asc: "Titulo A-Z",
  title_desc: "Titulo Z-A",
};

// Raw Spring Data sort strings we used to write to the URL; old bookmarks still carry them.
const LEGACY_SORTS = {
  "createdAt,desc": "recent",
  "createdAt,asc": "oldest",
  "title,asc": "title_asc",
  "title,desc": "title_desc",
};

export const TIME_OPTIONS = [
  { value: "short", label: "Un café" },
  { value: "medium", label: "Una pausa" },
  { value: "long", label: "Sobremesa" },
];

const SORT_OPTIONS = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }));

// Each facet owns its option source as a hook reference, consumed ONLY inside the
// generic FacetControl (one component instance per facet, so hook rules hold).
const useCategoryOptions = () => {
  const { categories } = usePublicCategories();
  return categories.map((c) => ({ value: c.slug, label: c.name }));
};

const useAuthorOptions = () => {
  const { authors } = usePublicAuthors();
  return authors.map((a) => ({ value: String(a.id), label: a.name }));
};

const useTimeOptions = () => TIME_OPTIONS;
const useSortOptions = () => SORT_OPTIONS;
const useNoOptions = () => null;

/**
 * The catalog's facet registry — THE single place a facet is defined.
 *
 * Contract (see spec, "extensibility acid test"): adding a facet is ONE new entry here,
 * bringing its own useOptions hook and a PURE toApiParams (value → params object, no
 * context). useCatalogFilters, CatalogFilterBar, FacetControl, useCatalogPosts and
 * publicPostService iterate this array generically and must never need edits for a new
 * facet. Registry order = sentence order in the UI.
 */
export const CATALOG_FACETS = [
  {
    key: "category",
    param: "category",
    type: "select",
    label: "Categoría",
    allLabel: "todas",
    defaultValue: null,
    clearable: true,
    useOptions: useCategoryOptions,
    toApiParams: (value) => (value ? { category: value } : {}),
  },
  {
    key: "time",
    param: "time",
    type: "select",
    label: "Tiempo",
    allLabel: "cualquiera",
    defaultValue: null,
    clearable: true,
    normalize: (raw) => {
      const lowered = raw?.toLowerCase();
      return TIME_OPTIONS.some((o) => o.value === lowered) ? lowered : null;
    },
    useOptions: useTimeOptions,
    toApiParams: (value) => (value ? { time: value } : {}),
  },
  {
    key: "author",
    param: "author",
    type: "select",
    label: "Autor",
    allLabel: "todos",
    defaultValue: null,
    clearable: true,
    useOptions: useAuthorOptions,
    toApiParams: (value) => (value ? { authorId: value } : {}),
  },
  {
    key: "sort",
    param: "sort",
    type: "select",
    label: "Orden",
    defaultValue: "featured",
    clearable: false, // "Limpiar filtros" resets filters, not the ordering
    normalize: (raw) => (SORT_LABELS[raw] ? raw : LEGACY_SORTS[raw] ?? null),
    useOptions: useSortOptions,
    toApiParams: (value) => ({ sort: value ?? "featured" }),
  },
  {
    key: "q",
    param: "q",
    type: "search",
    label: "Buscar",
    defaultValue: "",
    clearable: true,
    useOptions: useNoOptions,
    toApiParams: (value) => {
      const trimmed = (value ?? "").trim();
      return trimmed.length >= 2 ? { q: trimmed } : {};
    },
  },
];
