import { useRef, useEffect } from "react";

export default function TitleInput({ value, onChange, readOnly = false }) {
  const textareaRef = useRef(null);

  // Auto-resize the textarea to fit its content as the title grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Escribe el título aquí..."
      maxLength={200}
      readOnly={readOnly}
      className="w-full mb-2 px-0 py-2
                 text-4xl font-bold leading-tight
                 selection:bg-primary selection:text-primary-foreground
                 placeholder:text-stone-300 placeholder:font-normal
                 border-none focus:outline-none focus:ring-0
                 bg-transparent resize-none overflow-hidden"
      rows={1}
    />
  );
}
