function PanelCardSkeleton({ type = "default" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      {/* Título */}
      <div className="h-5 w-1/2 bg-gray-200 rounded mb-4"></div>

      {type === "stats" && (
        <div className="h-10 w-16 bg-gray-300 rounded mt-6"></div>
      )}

      {type === "list" && (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      {type === "actions" && (
        <div className="flex gap-3 mt-4">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      )}
    </div>
  );
}

export { PanelCardSkeleton };
