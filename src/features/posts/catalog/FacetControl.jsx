import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Shared editorial affordance: quiet text that reveals it's interactive on hover/focus.
const valueClasses =
  "underline decoration-dotted decoration-stone-400 underline-offset-4 " +
  "transition group-hover:text-rose-800 group-hover:decoration-rose-800 group-hover:decoration-solid " +
  "dark:decoration-stone-500 dark:group-hover:text-rose-400 dark:group-hover:decoration-rose-400";

function SelectFacet({ facet, value, onSelect }) {
  const options = facet.useOptions() ?? [];
  const active = options.find((option) => option.value === value) ?? null;
  const display = active?.label ?? facet.allLabel ?? options[0]?.label ?? "";

  return (
    <DropdownMenu>
      {/* min-h keeps the touch target ≥44px even though the text is thin */}
      <DropdownMenuTrigger
        className="group inline-flex min-h-11 cursor-pointer items-center gap-1 px-1 py-2 text-sm text-stone-600 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-rose-700 dark:text-stone-400"
        aria-label={`Filtrar por ${facet.label.toLowerCase()}, actual: ${display}`}
      >
        <span>{facet.label}:</span>
        <span className={`font-medium text-stone-900 dark:text-stone-200 ${valueClasses}`}>
          {display}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {facet.allLabel ? (
          <DropdownMenuItem onSelect={() => onSelect(facet.defaultValue)}>
            {facet.label}: {facet.allLabel}
          </DropdownMenuItem>
        ) : null}
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => onSelect(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchFacet({ facet, value, onSelect }) {
  const [draft, setDraft] = useState(value ?? "");
  const onSelectRef = useRef(onSelect);

  // Keep the latest onSelect in the ref.
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // URL is the source of truth: re-sync when it changes externally (back button, clear).
  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  // Debounce ~350ms before committing to the URL (replace: no history spam, and it
  // respects the API rate budget while typing).
  useEffect(() => {
    if ((draft ?? "") === (value ?? "")) return undefined;
    const timer = setTimeout(() => onSelectRef.current(draft, { replace: true }), 350);
    return () => clearTimeout(timer);
  }, [draft, value]);

  const inputId = `facet-${facet.key}`;

  return (
    <label
      htmlFor={inputId}
      className="inline-flex min-h-11 cursor-text items-center gap-1.5 px-1 py-2 text-sm text-stone-600 dark:text-stone-400"
    >
      <Search size={14} aria-hidden="true" />
      <span>{facet.label}:</span>
      <input
        id={inputId}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="título o autor"
        className="w-36 border-b border-dotted border-stone-400 bg-transparent pb-0.5 font-medium text-stone-900 outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:border-solid focus:border-rose-700 sm:w-44 dark:border-stone-500 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:border-rose-400"
      />
    </label>
  );
}

/** Renders one facet of the sentence; the facet's own useOptions hook runs here (one instance per facet). */
export default function FacetControl({ facet, value, onSelect }) {
  if (facet.type === "search") {
    return <SearchFacet facet={facet} value={value} onSelect={onSelect} />;
  }
  return <SelectFacet facet={facet} value={value} onSelect={onSelect} />;
}
