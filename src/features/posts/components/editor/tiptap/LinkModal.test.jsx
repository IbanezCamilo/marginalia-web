import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkModal from "./LinkModal";

function makeEditorMock(existingHref = null) {
  const mockRun = vi.fn();
  const chain = {
    focus: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    run: mockRun,
  };

  return {
    getAttributes: vi.fn((type) =>
      type === "link" && existingHref ? { href: existingHref } : {}
    ),
    chain: vi.fn().mockReturnValue(chain),
    _chain: chain,
    _run: mockRun,
  };
}

describe("LinkModal", () => {
  let onOpenChange;

  beforeEach(() => {
    onOpenChange = vi.fn();
  });

  function renderModal(editor, props = {}) {
    return render(
      <LinkModal
        editor={editor}
        open={true}
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  describe("title and buttons", () => {
    it("shows 'Agregar enlace' when no link is active", () => {
      renderModal(makeEditorMock());
      expect(screen.getByText("Agregar enlace")).toBeInTheDocument();
    });

    it("shows 'Editar enlace' when a link is already active at cursor", () => {
      renderModal(makeEditorMock("https://existing.com"));
      expect(screen.getByText("Editar enlace")).toBeInTheDocument();
    });

    it("shows 'Insertar' button for new links", () => {
      renderModal(makeEditorMock());
      expect(screen.getByRole("button", { name: "Insertar" })).toBeInTheDocument();
    });

    it("shows 'Actualizar' button when editing an existing link", () => {
      renderModal(makeEditorMock("https://existing.com"));
      expect(screen.getByRole("button", { name: "Actualizar" })).toBeInTheDocument();
    });

    it("hides 'Eliminar' button for new links", () => {
      renderModal(makeEditorMock());
      expect(screen.queryByRole("button", { name: "Eliminar" })).not.toBeInTheDocument();
    });

    it("shows 'Eliminar' button when editing an existing link", () => {
      renderModal(makeEditorMock("https://existing.com"));
      expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
    });
  });

  describe("URL input initial value", () => {
    it("starts empty for a new link", () => {
      renderModal(makeEditorMock());
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("prefills the href of an existing link", () => {
      renderModal(makeEditorMock("https://prefilled.com"));
      expect(screen.getByRole("textbox")).toHaveValue("https://prefilled.com");
    });
  });

  describe("URL validation on insert", () => {
    it("shows error and does not call run() when URL is empty", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(screen.getByText("Ingresa una URL.")).toBeInTheDocument();
      expect(editor._run).not.toHaveBeenCalled();
    });

    it("shows validation error for an invalid URL", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      // Spaces in the hostname cause the WHATWG URL parser to throw in all environments.
      await user.type(screen.getByRole("textbox"), "not a valid url");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(screen.getByText("Ingresa una URL válida.")).toBeInTheDocument();
      expect(editor._run).not.toHaveBeenCalled();
    });
  });

  describe("URL normalization", () => {
    it("adds https:// when protocol is missing", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(editor._chain.setLink).toHaveBeenCalledWith({ href: "https://example.com" });
    });

    it("does not double-prefix an already complete https:// URL", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "https://example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(editor._chain.setLink).toHaveBeenCalledWith({ href: "https://example.com" });
    });

    it("accepts http:// URLs without modification", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "http://example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(editor._chain.setLink).toHaveBeenCalledWith({ href: "http://example.com" });
    });

    it("accepts mailto: URLs without modification", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "mailto:user@example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(editor._chain.setLink).toHaveBeenCalledWith({ href: "mailto:user@example.com" });
    });
  });

  describe("successful insert", () => {
    it("calls chain().focus().extendMarkRange().setLink().run() on valid insert", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "https://example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(editor.chain).toHaveBeenCalled();
      expect(editor._chain.extendMarkRange).toHaveBeenCalledWith("link");
      expect(editor._chain.setLink).toHaveBeenCalledWith({ href: "https://example.com" });
      expect(editor._run).toHaveBeenCalled();
    });

    it("closes the modal after a successful insert", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "https://example.com");
      await user.click(screen.getByRole("button", { name: "Insertar" }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("triggers insert on Enter key press in the URL input", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.type(screen.getByRole("textbox"), "https://example.com");
      await user.keyboard("{Enter}");

      expect(editor._run).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Cancel", () => {
    it("closes the modal without calling run()", async () => {
      const editor = makeEditorMock();
      const user = userEvent.setup();
      renderModal(editor);

      await user.click(screen.getByRole("button", { name: "Cancelar" }));

      expect(editor._run).not.toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Remove link", () => {
    it("calls unsetLink().run() and closes modal", async () => {
      const editor = makeEditorMock("https://existing.com");
      const user = userEvent.setup();
      renderModal(editor);

      await user.click(screen.getByRole("button", { name: "Eliminar" }));

      expect(editor._chain.unsetLink).toHaveBeenCalled();
      expect(editor._run).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
