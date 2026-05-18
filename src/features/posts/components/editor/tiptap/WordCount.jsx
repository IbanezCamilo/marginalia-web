import { useEffect, useState } from "react";

const getStats = (editor) => {
  const words = editor.storage.characterCount.words();
  const characters = editor.storage.characterCount.characters();

  return {
    words,
    characters,
    readingTime: Math.max(1, Math.ceil(words / 200)),
  };
};

export default function WordCount({ editor }) {
  const [stats, setStats] = useState(() => getStats(editor));

  useEffect(() => {
    const updateStats = () => setStats(getStats(editor));

    updateStats();
    editor.on("update", updateStats);

    return () => editor.off("update", updateStats);
  }, [editor]);

  return (
    <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-stone-50 px-4 py-2 text-xs text-gray-500">
      <span>{stats.words} palabras</span>
      <span className="text-gray-300">/</span>
      <span>{stats.characters} caracteres</span>
      <span className="text-gray-300">/</span>
      <span>{stats.readingTime} min de lectura</span>
    </footer>
  );
}
