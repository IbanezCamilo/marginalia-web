/**
 * WordCount Component
 *
 * Displays real-time statistics about the editor content:
 * - Word count
 * - Character count
 * - Estimated reading time
 *
 * @param {Object} editor - The TipTap editor instance
 * @returns {JSX.Element} Statistics display component
 */
export default function WordCount({ editor }) {
  // CharacterCount extension automatically adds this storage to the editor
  // It updates in real-time as the user types

  const characters = editor.storage.characterCount.characters();
  const words = editor.storage.characterCount.words();

  // Calculate estimated reading time
  // Average reading speed is 200 words per minute
  // Math.ceil rounds up to ensure we don't show 0 minutes for short texts
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="text-sm text-gray-500 mb-2 flex justify-end gap-4">
      <span>{words} palabras</span>
      <span>{characters} caracteres</span>
      <span>~{readingTime} min de lectura</span>
    </div>
  );
}
