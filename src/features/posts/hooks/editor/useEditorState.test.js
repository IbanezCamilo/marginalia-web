import { vi, describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditorState } from "./useEditorState";

// Builds a minimal editor mock. `canReturn` controls the return value of all
// can().chain().focus().toggleX().run() calls and can().undo()/redo().
function createMockEditor({ canReturn = false, isActiveReturn = false, from = 0, to = 0 } = {}) {
  const runFn = vi.fn().mockReturnValue(canReturn);

  const chainFocusMethods = {
    toggleBold: () => ({ run: runFn }),
    toggleItalic: () => ({ run: runFn }),
    toggleStrike: () => ({ run: runFn }),
    toggleUnderline: () => ({ run: runFn }),
    toggleBulletList: () => ({ run: runFn }),
    toggleOrderedList: () => ({ run: runFn }),
    toggleBlockquote: () => ({ run: runFn }),
  };

  const canResult = {
    chain: () => ({ focus: () => chainFocusMethods }),
    undo: vi.fn().mockReturnValue(canReturn),
    redo: vi.fn().mockReturnValue(canReturn),
  };

  return {
    state: { selection: { from, to } },
    isActive: vi.fn().mockReturnValue(isActiveReturn),
    can: vi.fn().mockReturnValue(canResult),
    on: vi.fn(),
    off: vi.fn(),
  };
}

describe("useEditorState", () => {
  describe("initial state", () => {
    it("is fully populated on the first render (not an empty object)", () => {
      const editor = createMockEditor();
      const { result } = renderHook(() => useEditorState(editor));

      expect(result.current).toHaveProperty("isBold");
      expect(result.current).toHaveProperty("canBold");
      expect(result.current).toHaveProperty("isItalic");
      expect(result.current).toHaveProperty("canLink");
      expect(result.current).toHaveProperty("canUndo");
    });

    it("defaults all is* flags to false when editor has no active marks", () => {
      const editor = createMockEditor({ isActiveReturn: false });
      const { result } = renderHook(() => useEditorState(editor));

      expect(result.current.isBold).toBe(false);
      expect(result.current.isItalic).toBe(false);
      expect(result.current.isStrike).toBe(false);
      expect(result.current.isUnderline).toBe(false);
      expect(result.current.isLink).toBe(false);
      expect(result.current.isBulletList).toBe(false);
      expect(result.current.isOrderedList).toBe(false);
      expect(result.current.isBlockquote).toBe(false);
      expect(result.current.isHeading1).toBe(false);
      expect(result.current.isParagraph).toBe(false);
    });

    it("defaults all can* flags to false when can() returns false", () => {
      const editor = createMockEditor({ canReturn: false });
      const { result } = renderHook(() => useEditorState(editor));

      expect(result.current.canBold).toBe(false);
      expect(result.current.canItalic).toBe(false);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe("canLink logic", () => {
    it("is true when there is a text selection (to > from)", () => {
      const editor = createMockEditor({ from: 0, to: 5 });
      const { result } = renderHook(() => useEditorState(editor));
      expect(result.current.canLink).toBe(true);
    });

    it("is false when cursor is collapsed and no link is active", () => {
      const editor = createMockEditor({ from: 3, to: 3, isActiveReturn: false });
      const { result } = renderHook(() => useEditorState(editor));
      expect(result.current.canLink).toBe(false);
    });

    it("is true when cursor is on an existing link (even without selection)", () => {
      const editor = createMockEditor({ from: 3, to: 3 });
      editor.isActive.mockImplementation((name) => name === "link");
      const { result } = renderHook(() => useEditorState(editor));
      expect(result.current.canLink).toBe(true);
    });

    it("is true when isActive returns true for link", () => {
      const editor = createMockEditor();
      editor.isActive.mockReturnValue(true);
      const { result } = renderHook(() => useEditorState(editor));
      expect(result.current.isLink).toBe(true);
      expect(result.current.canLink).toBe(true);
    });
  });

  describe("event listeners", () => {
    it("registers transaction and selectionUpdate listeners", () => {
      const editor = createMockEditor();
      renderHook(() => useEditorState(editor));

      expect(editor.on).toHaveBeenCalledWith("transaction", expect.any(Function));
      expect(editor.on).toHaveBeenCalledWith("selectionUpdate", expect.any(Function));
    });

    it("unregisters both listeners on unmount", () => {
      const editor = createMockEditor();
      const { unmount } = renderHook(() => useEditorState(editor));
      unmount();

      expect(editor.off).toHaveBeenCalledWith("transaction", expect.any(Function));
      expect(editor.off).toHaveBeenCalledWith("selectionUpdate", expect.any(Function));
    });

    it("updates state when a transaction event fires", () => {
      let transactionCb;
      const editor = createMockEditor();
      editor.on.mockImplementation((event, cb) => {
        if (event === "transaction") transactionCb = cb;
      });

      const { result } = renderHook(() => useEditorState(editor));

      editor.isActive.mockReturnValue(true);

      act(() => {
        transactionCb();
      });

      expect(result.current.isBold).toBe(true);
    });

    it("updates state when a selectionUpdate event fires", () => {
      let selectionCb;
      const editor = createMockEditor({ from: 0, to: 0 });
      editor.on.mockImplementation((event, cb) => {
        if (event === "selectionUpdate") selectionCb = cb;
      });

      const { result } = renderHook(() => useEditorState(editor));
      expect(result.current.canLink).toBe(false);

      // Simulate cursor moving into a selection
      editor.state.selection.to = 5;

      act(() => {
        selectionCb();
      });

      expect(result.current.canLink).toBe(true);
    });
  });
});
