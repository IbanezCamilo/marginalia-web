import { vi, describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import WordCount from "./WordCount";

function makeEditorMock(words = 0, characters = 0) {
  const listeners = {};
  return {
    storage: {
      characterCount: {
        words: vi.fn().mockReturnValue(words),
        characters: vi.fn().mockReturnValue(characters),
      },
    },
    on: vi.fn((event, cb) => {
      listeners[event] = cb;
    }),
    off: vi.fn(),
    _trigger: (event) => listeners[event]?.(),
  };
}

describe("WordCount", () => {
  describe("initial render", () => {
    it("displays the word count", () => {
      const editor = makeEditorMock(42, 200);
      render(<WordCount editor={editor} />);
      expect(screen.getByText("42 palabras")).toBeInTheDocument();
    });

    it("displays the character count", () => {
      const editor = makeEditorMock(42, 200);
      render(<WordCount editor={editor} />);
      expect(screen.getByText("200 caracteres")).toBeInTheDocument();
    });

    it.each([
      [0, 1],
      [100, 1],
      [200, 1],
      [201, 2],
      [400, 2],
      [401, 3],
    ])("%i words → %i min reading time", (words, expectedMin) => {
      const editor = makeEditorMock(words, 0);
      render(<WordCount editor={editor} />);
      expect(screen.getByText(`${expectedMin} min de lectura`)).toBeInTheDocument();
    });
  });

  describe("event listener", () => {
    it("registers an update listener on mount", () => {
      const editor = makeEditorMock();
      render(<WordCount editor={editor} />);
      expect(editor.on).toHaveBeenCalledWith("update", expect.any(Function));
    });

    it("unregisters the update listener on unmount", () => {
      const editor = makeEditorMock();
      const { unmount } = render(<WordCount editor={editor} />);
      unmount();
      expect(editor.off).toHaveBeenCalledWith("update", expect.any(Function));
    });

    it("recalculates word count when the update event fires", () => {
      const editor = makeEditorMock(10, 50);
      render(<WordCount editor={editor} />);

      editor.storage.characterCount.words.mockReturnValue(99);
      editor.storage.characterCount.characters.mockReturnValue(495);

      act(() => {
        editor._trigger("update");
      });

      expect(screen.getByText("99 palabras")).toBeInTheDocument();
      expect(screen.getByText("495 caracteres")).toBeInTheDocument();
    });

    it("recalculates reading time when the update event fires", () => {
      const editor = makeEditorMock(0, 0);
      render(<WordCount editor={editor} />);

      editor.storage.characterCount.words.mockReturnValue(201);

      act(() => {
        editor._trigger("update");
      });

      expect(screen.getByText("2 min de lectura")).toBeInTheDocument();
    });
  });
});
