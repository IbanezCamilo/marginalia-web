import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { parseEditorContent } from "@/features/posts/utils/editorContent";

// Mock @tiptap/react before importing the hook so the factory runs first.
// The entire module is replaced — TipTap never initializes in jsdom.
vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn(),
}));

// Mock editorExtensions so TipTap extension packages are never imported.
vi.mock(
  import("@/features/posts/components/editor/tiptap/editorExtensions"),
  async (importOriginal) => {
    // We only need the shape, not the real extensions.
    void importOriginal;
    return { editorExtensions: [] };
  }
);

// Imports happen AFTER vi.mock() calls (Vitest hoists them automatically).
import { useEditor } from "@tiptap/react";
import { useTiptapEditor } from "./useTiptapEditor";

const SERIALIZED_EMPTY = '{"type":"doc","content":[]}';

function buildMockEditor() {
  return {
    getJSON: vi.fn().mockReturnValue({ type: "doc", content: [] }),
    setEditable: vi.fn(),
    commands: { setContent: vi.fn() },
  };
}

describe("useTiptapEditor", () => {
  let mockEditor;
  let capturedConfig;

  beforeEach(() => {
    mockEditor = buildMockEditor();
    capturedConfig = null;

    useEditor.mockImplementation((config) => {
      capturedConfig = config;
      return mockEditor;
    });
  });

  it("returns the editor instance from useEditor", () => {
    const { result } = renderHook(() =>
      useTiptapEditor({ content: "", onChange: vi.fn(), editable: true })
    );
    expect(result.current).toBe(mockEditor);
  });

  it("parses the initial content before passing it to useEditor", () => {
    const rawJson = JSON.stringify({ type: "doc", content: [] });
    renderHook(() =>
      useTiptapEditor({ content: rawJson, onChange: vi.fn(), editable: true })
    );

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        content: parseEditorContent(rawJson),
      })
    );
  });

  it("calls onChange with serialized JSON on editor update", () => {
    const onChange = vi.fn();
    renderHook(() =>
      useTiptapEditor({ content: "", onChange, editable: true })
    );

    act(() => {
      capturedConfig.onUpdate({ editor: mockEditor });
    });

    expect(onChange).toHaveBeenCalledWith(SERIALIZED_EMPTY);
  });

  it("calls setContent when content prop changes to a new value", () => {
    const { rerender } = renderHook(
      ({ content }) =>
        useTiptapEditor({ content, onChange: vi.fn(), editable: true }),
      { initialProps: { content: "initial" } }
    );

    rerender({ content: "updated-content" });

    expect(mockEditor.commands.setContent).toHaveBeenCalled();
  });

  it("does not call setContent when content prop matches the last synced value", () => {
    const onChange = vi.fn();
    const { rerender } = renderHook(
      ({ content }) => useTiptapEditor({ content, onChange, editable: true }),
      { initialProps: { content: "" } }
    );

    // Simulate typing: onUpdate fires and sets lastSyncedContent to the serialized JSON
    act(() => {
      capturedConfig.onUpdate({ editor: mockEditor });
    });

    mockEditor.commands.setContent.mockClear();

    // Parent re-renders with the same serialized content that was just emitted
    rerender({ content: SERIALIZED_EMPTY });

    expect(mockEditor.commands.setContent).not.toHaveBeenCalled();
  });

  it("calls setEditable when the editable prop changes", () => {
    const { rerender } = renderHook(
      ({ editable }) =>
        useTiptapEditor({ content: "", onChange: vi.fn(), editable }),
      { initialProps: { editable: true } }
    );

    rerender({ editable: false });

    expect(mockEditor.setEditable).toHaveBeenCalledWith(false);
  });

  it("passes immediatelyRender: false to useEditor (SSR-safe)", () => {
    renderHook(() =>
      useTiptapEditor({ content: "", onChange: vi.fn(), editable: true })
    );
    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({ immediatelyRender: false })
    );
  });
});
