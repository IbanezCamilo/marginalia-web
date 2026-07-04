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
    <footer className="sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-3 rounded-b-md border-t border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
      <span>{stats.words} palabras</span>
      <span className="text-muted-foreground">/</span>
      <span>{stats.characters} caracteres</span>
      <span className="text-muted-foreground">/</span>
      <span>{stats.readingTime} min de lectura</span>
    </footer>
  );
}
