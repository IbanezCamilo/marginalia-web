import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ViewAllCategoriesTile({ remainingCount = 0 }) {
  return (
    <Link
      to="/catalog"
      className="group flex min-h-24 flex-col justify-between rounded-md border border-dashed border-stone-300 bg-white p-4 transition duration-200 hover:border-solid hover:border-stone-950 hover:bg-stone-50 hover:shadow-sm dark:border-stone-600 dark:bg-stone-900 dark:hover:border-stone-400 dark:hover:bg-stone-800"
    >
      <ArrowRight
        size={18}
        strokeWidth={1.7}
        className="text-rose-700 transition-all group-hover:translate-x-1 group-hover:text-stone-950 motion-reduce:group-hover:translate-x-0 dark:text-rose-500 dark:group-hover:text-stone-100"
        aria-hidden="true"
      />
      <span className="mt-6 text-sm font-semibold text-stone-900 transition-colors group-hover:text-rose-800 dark:text-stone-100 dark:group-hover:text-rose-400">
        Ver todas las categorías
        {remainingCount > 0 && (
          <span className="ml-2 font-normal text-stone-500 dark:text-stone-400">
            +{remainingCount} categorías
          </span>
        )}
      </span>
    </Link>
  );
}
