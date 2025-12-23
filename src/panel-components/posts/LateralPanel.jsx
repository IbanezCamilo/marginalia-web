export default function LateralPanel({ children }) {
  return (
    <aside className="flex flex-col border p-4 rounded-md h-fit">
      {children}
    </aside>
  );
}
