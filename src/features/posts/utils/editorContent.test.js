import { describe, it, expect } from "vitest";
import {
  parseEditorContent,
  serializeEditorContent,
  editorContentToHtml,
  editorContentToText,
  isEditorContentEmpty,
} from "./editorContent";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

const doc = (...nodes) => ({ type: "doc", content: nodes });
const p = (children = []) => ({ type: "paragraph", content: children });
const pText = (text) => p([{ type: "text", text }]);
const pMarked = (text, ...marks) => p([{ type: "text", text, marks }]);
const heading = (level, text, attrs = {}) => ({
  type: "heading",
  attrs: { level, ...attrs },
  content: [{ type: "text", text }],
});
const codeBlock = (code) => ({
  type: "codeBlock",
  content: [{ type: "text", text: code }],
});
const listItem = (...children) => ({ type: "listItem", content: children });
const bulletList = (...items) => ({ type: "bulletList", content: items });
const orderedList = (startNum, ...items) => ({
  type: "orderedList",
  attrs: { start: startNum },
  content: items,
});

describe("parseEditorContent", () => {
  it("returns EMPTY_DOCUMENT for null", () => {
    expect(parseEditorContent(null)).toEqual(EMPTY_DOC);
  });

  it("returns EMPTY_DOCUMENT for undefined", () => {
    expect(parseEditorContent(undefined)).toEqual(EMPTY_DOC);
  });

  it("returns EMPTY_DOCUMENT for empty string", () => {
    expect(parseEditorContent("")).toEqual(EMPTY_DOC);
  });

  it("returns plain objects as-is (same reference)", () => {
    const obj = { type: "doc", content: [] };
    expect(parseEditorContent(obj)).toBe(obj);
  });

  it("parses valid JSON strings into objects", () => {
    const parsed = { type: "doc", content: [] };
    expect(parseEditorContent(JSON.stringify(parsed))).toEqual(parsed);
  });

  it("returns EMPTY_DOCUMENT for malformed JSON strings", () => {
    expect(parseEditorContent("{not: valid")).toEqual(EMPTY_DOC);
  });

  it("returns non-JSON strings (HTML) as-is", () => {
    const html = "<p>Hello</p>";
    expect(parseEditorContent(html)).toBe(html);
  });
});

describe("serializeEditorContent", () => {
  it("returns JSON-stringified result of editor.getJSON()", () => {
    const editorMock = { getJSON: () => ({ type: "doc", content: [] }) };
    expect(serializeEditorContent(editorMock)).toBe('{"type":"doc","content":[]}');
  });
});

describe("editorContentToHtml", () => {
  describe("edge cases", () => {
    it("returns empty string for null", () => {
      expect(editorContentToHtml(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
      expect(editorContentToHtml(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(editorContentToHtml("")).toBe("");
    });

    it("passes non-JSON HTML strings through unchanged", () => {
      const html = "<p>Legacy content</p>";
      expect(editorContentToHtml(html)).toBe(html);
    });
  });

  describe("text marks", () => {
    it("renders plain paragraph text", () => {
      expect(editorContentToHtml(doc(pText("Hello")))).toBe("<p>Hello</p>");
    });

    it("renders bold mark", () => {
      expect(editorContentToHtml(doc(pMarked("bold", { type: "bold" })))).toBe(
        "<p><strong>bold</strong></p>"
      );
    });

    it("renders italic mark", () => {
      expect(editorContentToHtml(doc(pMarked("italic", { type: "italic" })))).toBe(
        "<p><em>italic</em></p>"
      );
    });

    it("renders strikethrough mark", () => {
      expect(editorContentToHtml(doc(pMarked("struck", { type: "strike" })))).toBe(
        "<p><s>struck</s></p>"
      );
    });

    it("renders underline mark", () => {
      expect(editorContentToHtml(doc(pMarked("under", { type: "underline" })))).toBe(
        "<p><u>under</u></p>"
      );
    });

    it("renders code mark as <code>", () => {
      expect(editorContentToHtml(doc(pMarked("const x = 1", { type: "code" })))).toBe(
        "<p><code>const x = 1</code></p>"
      );
    });

    it("renders link mark with security attributes", () => {
      const node = doc(pMarked("click me", { type: "link", attrs: { href: "https://example.com" } }));
      expect(editorContentToHtml(node)).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">click me</a></p>'
      );
    });

    it("renders stacked marks (bold + italic)", () => {
      const node = doc(
        p([{ type: "text", text: "text", marks: [{ type: "bold" }, { type: "italic" }] }])
      );
      const html = editorContentToHtml(node);
      expect(html).toContain("<strong>");
      expect(html).toContain("<em>");
      expect(html).toContain("text");
    });
  });

  describe("block nodes", () => {
    it.each([1, 2, 3])("renders h%i heading", (level) => {
      expect(editorContentToHtml(doc(heading(level, "Title")))).toBe(
        `<h${level}>Title</h${level}>`
      );
    });

    it("renders blockquote", () => {
      const node = doc({ type: "blockquote", content: [pText("quote text")] });
      expect(editorContentToHtml(node)).toBe("<blockquote><p>quote text</p></blockquote>");
    });

    it("renders hardBreak as <br>", () => {
      const node = doc(
        p([{ type: "text", text: "a" }, { type: "hardBreak" }, { type: "text", text: "b" }])
      );
      expect(editorContentToHtml(node)).toBe("<p>a<br>b</p>");
    });

    it("renders horizontalRule as <hr>", () => {
      expect(editorContentToHtml(doc({ type: "horizontalRule" }))).toBe("<hr>");
    });
  });

  describe("codeBlock node", () => {
    it("renders codeBlock as <pre><code>", () => {
      expect(editorContentToHtml(doc(codeBlock("const x = 1;")))).toBe(
        "<pre><code>const x = 1;</code></pre>"
      );
    });

    it("escapes HTML entities inside codeBlock (XSS prevention)", () => {
      expect(editorContentToHtml(doc(codeBlock("<script>alert(1)</script>")))).toBe(
        "<pre><code>&lt;script&gt;alert(1)&lt;/script&gt;</code></pre>"
      );
    });
  });

  describe("list nodes", () => {
    it("renders bulletList", () => {
      const node = doc(bulletList(listItem(pText("one")), listItem(pText("two"))));
      expect(editorContentToHtml(node)).toBe(
        "<ul><li><p>one</p></li><li><p>two</p></li></ul>"
      );
    });

    it("renders orderedList without start attr when start is 1", () => {
      const node = doc(orderedList(1, listItem(pText("item"))));
      expect(editorContentToHtml(node)).toBe("<ol><li><p>item</p></li></ol>");
    });

    it("renders orderedList with start attr when start != 1", () => {
      const node = doc(orderedList(3, listItem(pText("item"))));
      expect(editorContentToHtml(node)).toBe('<ol start="3"><li><p>item</p></li></ol>');
    });

    it("omits start attr when start is missing (defaults to 1)", () => {
      const node = doc({ type: "orderedList", content: [listItem(pText("x"))] });
      expect(editorContentToHtml(node)).toBe("<ol><li><p>x</p></li></ol>");
    });
  });

  describe("text alignment", () => {
    it("applies text-align style to paragraph", () => {
      const node = doc({
        type: "paragraph",
        attrs: { textAlign: "center" },
        content: [{ type: "text", text: "hi" }],
      });
      expect(editorContentToHtml(node)).toBe('<p style="text-align: center">hi</p>');
    });

    it("applies text-align style to heading", () => {
      const node = doc(heading(2, "title", { textAlign: "right" }));
      expect(editorContentToHtml(node)).toBe('<h2 style="text-align: right">title</h2>');
    });

    it.each(["left", "center", "right", "justify"])("accepts valid alignment '%s'", (align) => {
      const node = doc({
        type: "paragraph",
        attrs: { textAlign: align },
        content: [{ type: "text", text: "x" }],
      });
      expect(editorContentToHtml(node)).toContain(`style="text-align: ${align}"`);
    });

    it("ignores invalid textAlign values (CSS injection whitelist)", () => {
      const node = doc({
        type: "paragraph",
        attrs: { textAlign: "expression(alert(1))" },
        content: [{ type: "text", text: "x" }],
      });
      const html = editorContentToHtml(node);
      expect(html).toBe("<p>x</p>");
      expect(html).not.toContain("style=");
    });
  });

  describe("security (XSS prevention)", () => {
    it("escapes HTML in plain text content", () => {
      expect(editorContentToHtml(doc(pText("<script>alert(1)</script>")))).toBe(
        "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>"
      );
    });

    it("escapes special chars in link href", () => {
      const node = doc(
        pMarked("link", { type: "link", attrs: { href: 'https://a.com?x=1&y=<2>' } })
      );
      const html = editorContentToHtml(node);
      expect(html).not.toContain("<2>");
      expect(html).toContain("&lt;2&gt;");
    });
  });
});

describe("editorContentToText", () => {
  it("extracts plain text from a JSON doc", () => {
    expect(editorContentToText(doc(pText("Hello world")))).toBe("Hello world");
  });

  it("joins text from multiple paragraphs", () => {
    const text = editorContentToText(doc(pText("First"), pText("Second")));
    expect(text).toContain("First");
    expect(text).toContain("Second");
  });

  it("strips HTML tags from legacy HTML strings", () => {
    expect(editorContentToText("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });

  it("returns empty string for an empty doc", () => {
    expect(editorContentToText(EMPTY_DOC)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(editorContentToText(null)).toBe("");
  });
});

describe("isEditorContentEmpty", () => {
  it("returns true for null", () => {
    expect(isEditorContentEmpty(null)).toBe(true);
  });

  it("returns true for an empty doc", () => {
    expect(isEditorContentEmpty(EMPTY_DOC)).toBe(true);
  });

  it("returns false for a doc with text", () => {
    expect(isEditorContentEmpty(doc(pText("Hello")))).toBe(false);
  });

  it("returns false for a JSON string doc with text", () => {
    expect(isEditorContentEmpty(JSON.stringify(doc(pText("Hi"))))).toBe(false);
  });

  it("returns true for a doc with only empty paragraphs", () => {
    expect(isEditorContentEmpty(doc(p()))).toBe(true);
  });
});
