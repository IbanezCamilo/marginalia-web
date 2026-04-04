import { useRef, useEffect } from "react";

export default function TitleInput({ value, onChange }) {
  const textareaRef = useRef(null);

  //Auto-resize while writing
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
      minLength={15}
      maxLength={70}
      className="w-full mb-2 px-0 py-2
                 text-4xl font-bold leading-tight
                 placeholder:text-gray-300 placeholder:font-normal
                 border-none focus:outline-none focus:ring-0
                 bg-transparent resize-none overflow-hidden"
      rows={1}
    />
  );
}
