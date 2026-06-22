/** Field-level validation message, wired via `aria-describedby` on the input it belongs to. */
export function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {children}
    </p>
  );
}
