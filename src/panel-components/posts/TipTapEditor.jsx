import { useState, useEffect } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineEditor from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import "./TiptapEditor.css"; // Import custom CSS styles
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineEditor,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-rose-600 underline hover:text-rose-700 transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder: "Empieza a escribir tu próxima historia...",
      }),
      CharacterCount,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-2",
      },
    },
  });

  return (
    <div>
      {editor && (
        <>
          <MenuBar editor={editor} />
          <WordCount editor={editor} />
        </>
      )}
      <div className="w-full max-h-80 border overflow-auto rounded bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/**
 * LinkModal Component
 *
 * Modal dialog for adding/editing links in the editor
 * @param {Object} editor - The TipTap editor instance
 * @param {boolean} open - boolean that controls modal visibility(comes from showLinkModal)
 * @param {Function} onOpenChange - callback Function to change the state(comes from setShowLinkModal)
 * @returns {JSX.Element} Statistics display component
 *
 */
function LinkModal({ editor, open, onOpenChange }) {
  const [url, setUrl] = useState(""); //Local State to storage URL; void Inicialize
  const [error, setError] = useState(""); // State to validation error messages

  useEffect(() => {
    if (open) {
      const current = editor.getAttributes("link"); //the current selection has a Link?
      setUrl(current.href || ""); //true: edit a existent link; false: create a new link
      setError(""); // clean every prev error
    }
  }, [open, editor]);

  //Validation function
  const isValidUrl = (urlString) => {
    // recieve a Url as String
    try {
      const urlObj = new URL(urlString); //Javascript Function to validate the URL
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"; // Verify the protocols for security
    } catch (e) {
      return false;
    }
  };

  const handleInsert = () => {
    setError("");

    //validation to verify if the url is empty
    if (!url.trim()) {
      setError("URL requerida");
      return;
    }

    //Add the protocol in the url (if it's missing)
    let finalUrl = url.trim(); // remove blank space
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // url has a protocol?
      finalUrl = "https://" + finalUrl; //if not concatened the protocol in the url
    }

    //Validate the complete format
    if (!isValidUrl(finalUrl)) {
      setError("Porfavor ingresa un URL valido");
      return;
    }

    //Apply the link in the editor
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: finalUrl })
      .run();

    //Clean and close
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  //Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInsert();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editor.getAttributes("link").href
              ? "Editar Link"
              : "Insertar Link"}
          </DialogTitle>
          <DialogDescription>
            Ingresa la URL del enlace que desees agregar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="link" className="py-2">
              URL
            </Label>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com"
              autoFocus
            />
            {/**Error message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          {/**Buttons */}
          <div className="flex justify-end gap-2">
            {editor.getAttributes("link").href && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  onOpenChange(false);
                }}
              >
                Eliminar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleInsert}>
              {editor.getAttributes("link").href ? "Actualizar" : "Insertar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
function WordCount({ editor }) {
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

function DropDownMenuAlign({ editor, state }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="px-3 py-1 rounded text-sm border bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
        >
          {/* Icono según la alineación actual */}
          {state.isLeft && <AlignLeft size={16} />}
          {state.isCenter && <AlignCenter size={16} />}
          {state.isRight && <AlignRight size={16} />}
          {state.isJustify && <AlignJustify size={16} />}
          <ChevronDown size={12} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={state.isLeft ? "bg-rose-100" : ""}
        >
          <AlignLeft size={16} /> Alinear a la izquierda
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={state.isCenter ? "bg-rose-100" : ""}
        >
          <AlignCenter size={16} /> Centrar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={state.isRight ? "bg-rose-100" : ""}
        >
          <AlignRight size={16} /> Alinear a la derecha
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={state.isJustify ? "bg-rose-100" : ""}
        >
          <AlignJustify size={16} /> Justificar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useEditorState(editor) {
  // This hook manages the editor state
  const [state, setState] = useState({});

  useEffect(() => {
    // Only update state if the editor is defined
    if (!editor) return;

    // Update the current state
    const updateState = () => {
      //Check if there's a text selection or if the cursor is on an existing link
      const { from, to } = editor.state.selection;
      const hasSelection = from != to || editor.isActive("link");
      setState({
        isBold: editor.isActive("bold"),
        canBold: editor.can().chain().toggleBold().run(),
        isItalic: editor.isActive("italic"),
        canItalic: editor.can().chain().toggleItalic().run(),
        isStrike: editor.isActive("strike"),
        canStrike: editor.can().chain().toggleStrike().run(),
        isUnderline: editor.isActive("underline"),
        canUnderline: editor.can().chain().toggleUnderline().run(),
        isLink: editor.isActive("link"),
        canLink:
          hasSelection && editor.can().chain().setLink({ href: "" }).run(),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        isBulletList: editor.isActive("bulletList"),
        canBulletList: editor.can().chain().toggleBulletList().run(),
        isOrderedList: editor.isActive("orderedList"),
        canOrderedList: editor.can().chain().toggleOrderedList().run(),
        isBlockquote: editor.isActive("blockquote"),
        canBlockquote: editor.can().chain().toggleBlockquote().run(),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isHeading3: editor.isActive("heading", { level: 3 }),
        isLeft: editor.isActive({ textAlign: "left" }),
        isCenter: editor.isActive({ textAlign: "center" }),
        isRight: editor.isActive({ textAlign: "right" }),
        isJustify: editor.isActive({ textAlign: "justify" }),
      });
    };

    // Initialize state
    updateState();
    // Fired when editor content changes (typing, deleting)
    editor.on("update", updateState);
    // Fired when text selection changes (even without typing)
    editor.on("selectionUpdate", updateState);

    // Clean up listeners on component unmount to prevent memory leaks
    return () => {
      editor.off("update", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  return state;
}

function MenuBar({ editor }) {
  const state = useEditorState(editor);
  //State variable to control modal visibility
  const [showLinkModal, setShowLinkModal] = useState(false);

  const buttonClass = (isActive, canDo) =>
    `px-3 py-1 rounded text-sm border transition 
    ${isActive ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-700"} 
    ${!canDo ? "opacity-60 cursor-not-allowed" : "hover:bg-rose-300"}`;

  const handleLinkClick = () => {
    setShowLinkModal(true);
  };
  return (
    <>
      <div className="control-group flex-col gap-2">
        {/**First row: Inline formatting + Lists/Quotes + Headings + History */}
        <div className="flex flex-wrap gap-4 p-2">
          {/**Inline Formatting */}
          <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!state.canBold}
              className={buttonClass(state.isBold, state.canBold)}
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!state.canItalic}
              className={buttonClass(state.isItalic, state.canItalic)}
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!state.canStrike}
              className={buttonClass(state.isStrike, state.canStrike)}
            >
              <Strikethrough size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!state.canUnderline}
              className={buttonClass(state.isUnderline, state.canUnderline)}
            >
              <Underline size={16} />
            </button>
            {/**Link Extension Button*/}
            <button
              type="button"
              onClick={handleLinkClick}
              disabled={!state.canLink}
              className={buttonClass(state.isLink, state.canLink)}
              title={state.isLink ? "Remover Link" : "Agregar Link"}
            >
              🔗
            </button>
          </div>

          {/**Lists and quotes */}
          <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={!state.canBulletList}
              className={buttonClass(state.isBulletList, state.canBulletList)}
            >
              • Lista
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!state.canOrderedList}
              className={buttonClass(state.isOrderedList, state.canOrderedList)}
            >
              1. Lista
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!state.canBlockquote}
              className={buttonClass(state.isBlockquote, state.canBlockquote)}
            >
              " Cita
            </button>
          </div>

          {/**Headings */}
          <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={buttonClass(state.isHeading1, true)}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={buttonClass(state.isHeading2, true)}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={buttonClass(state.isHeading3, true)}
            >
              H3
            </button>
          </div>
          {/**Alignment */}
          <div className="button-group flex gap-2 pr-4 border-r border-gray-300">
            <DropDownMenuAlign editor={editor} state={state} />
          </div>

          {/**History - Undo/Redo */}
          <div className="button-group flex gap-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!state.canUndo}
              className={buttonClass(false, state.canUndo)}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!state.canRedo}
              className={buttonClass(false, state.canRedo)}
            >
              Redo
            </button>
          </div>
        </div>
      </div>
      {/**Modal appears when showLinkModal is true*/}
      {
        <LinkModal
          editor={editor}
          open={showLinkModal}
          onOpenChange={setShowLinkModal}
        />
      }
    </>
  );
}
