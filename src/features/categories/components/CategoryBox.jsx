import { Hash } from "lucide-react";

export default function CategoryBox({ category, nombre }) {
  const name = category?.name ?? nombre;

  return (
    <div className="group flex min-h-24 flex-col justify-between rounded-md border border-stone-200 bg-white p-4 transition duration-200 hover:border-stone-300 hover:bg-stone-50">
      <Hash
        size={18}
        strokeWidth={1.7}
        className="text-rose-700 transition-colors group-hover:text-stone-950"
      />
      <span className="mt-6 text-sm font-semibold text-stone-900">{name}</span>
    </div>
  );
}
