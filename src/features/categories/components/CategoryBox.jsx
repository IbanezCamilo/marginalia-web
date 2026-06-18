import { Hash } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryBox({ category, nombre }) {
  const name = category?.name ?? nombre;
  const slug = category?.slug ?? name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/catalog?category=${slug}`}
      className="group flex min-h-24 flex-col justify-between rounded-md border border-stone-200 bg-white p-4 transition duration-200 hover:border-stone-950 hover:bg-stone-50 hover:shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:hover:border-stone-400 dark:hover:bg-stone-800"
    >
      <Hash
        size={18}
        strokeWidth={1.7}
        className="text-rose-700 transition-colors group-hover:text-stone-950 dark:text-rose-500 dark:group-hover:text-stone-100"
        aria-hidden="true"
      />
      <span className="mt-6 text-sm font-semibold text-stone-900 transition-colors group-hover:text-rose-800 dark:text-stone-100 dark:group-hover:text-rose-400">
        {name}
      </span>
    </Link>
  );
}
