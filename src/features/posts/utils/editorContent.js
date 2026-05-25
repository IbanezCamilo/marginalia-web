const EMPTY_DOCUMENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isJsonLike = (value) => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
};

export const parseEditorContent = (content) => {
  if (!content) return EMPTY_DOCUMENT;
  if (typeof content === "object") return content;

  if (isJsonLike(content)) {
    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON parse failed:", err.message);
      return EMPTY_DOCUMENT;
    }
  }

  return content;
};

export const serializeEditorContent = (editor) =>
  JSON.stringify(editor.getJSON());

const renderMarks = (text, marks = []) => {
  return marks?.reduce((current, mark) => {
    if (mark.type === "bold") return `<strong>${current}</strong>`;
    if (mark.type === "italic") return `<em>${current}</em>`;
    if (mark.type === "strike") return `<s>${current}</s>`;
    if (mark.type === "underline") return `<u>${current}</u>`;
    if (mark.type === "link") {
      const href = escapeHtml(mark.attrs?.href ?? "#");
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${current}</a>`;
    }
    return current;
  }, text) ?? text;
};

const renderChildren = (node) =>
  (node.content ?? []).map((child) => renderNode(child)).join("");

const alignmentStyle = (attrs = {}) =>
  attrs.textAlign ? ` style="text-align: ${escapeHtml(attrs.textAlign)}"` : "";

const renderListItem = (node) => `<li>${renderChildren(node)}</li>`;

const renderNode = (node) => {
  if (!node) return "";

  if (node.type === "text") {
    return renderMarks(escapeHtml(node.text ?? ""), node.marks);
  }

  if (node.type === "hardBreak") return "<br>";
  if (node.type === "horizontalRule") return "<hr>";

  if (node.type === "paragraph") {
    return `<p${alignmentStyle(node.attrs)}>${renderChildren(node)}</p>`;
  }

  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 1), 6);
    return `<h${level}${alignmentStyle(node.attrs)}>${renderChildren(node)}</h${level}>`;
  }

  if (node.type === "blockquote") {
    return `<blockquote${alignmentStyle(node.attrs)}>${renderChildren(node)}</blockquote>`;
  }

  if (node.type === "bulletList") {
    return `<ul>${(node.content ?? []).map(renderListItem).join("")}</ul>`;
  }

  if (node.type === "orderedList") {
    return `<ol>${(node.content ?? []).map(renderListItem).join("")}</ol>`;
  }

  if (node.type === "listItem") return renderListItem(node);
  if (node.type === "doc") return renderChildren(node);
  
  if (node.content) {
    return renderChildren(node);
  }

  return "";
};

export const editorContentToHtml = (content) => {
  if (!content) return "";
  
  if (typeof content === "string" && !isJsonLike(content)) {
    console.log("⚠️  Not JSON-like, returning as-is");
    return content;
  }
  
  const parsed = parseEditorContent(content);
  const html = renderNode(parsed);
  
  console.log("📄 Generated HTML length:", html.length);
  
  return html;
};

export const editorContentToText = (content) => {
  const parsed = parseEditorContent(content);

  if (typeof parsed === "string") {
    return parsed.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const walk = (node) => {
    if (!node) return "";
    if (node.type === "text") return node.text ?? "";
    return (node.content ?? []).map(walk).join(" ");
  };

  return walk(parsed).replace(/\s+/g, " ").trim();
};

export const isEditorContentEmpty = (content) =>
  editorContentToText(content).length === 0;
