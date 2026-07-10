# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:5173
npm run build        # production build → dist/
npm run lint         # ESLint (flat config, no --fix by default)
npm run preview      # preview production build locally
```

No test runner is configured. ESLint uses the v9 flat config format (`eslint.config.js`).

## Environment Variables

Copy `.env.sample` → `.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend origin **without** `/api` (config.js appends it), e.g. `http://localhost:8080`. Also used to build image URLs. |

Read through `src/lib/config.js` (`API_URL` = `VITE_API_URL` + `/api`, `BASE_URL` = `VITE_API_URL`) and never hardcoded elsewhere. Vite inlines it at **build time**; for Docker/Dokploy it must be a build `ARG`, not a runtime env var (see `Dockerfile`). Prod: `https://api.readmarginalia.net`.

## Architecture

**Feature-based** structure under `src/features/` (auth, posts, categories, dashboard, profile, authors). Each feature owns its pages, components, services, and hooks. Public top-level pages live in `src/pages/`.

Path alias `@` maps to `src/`.

### Data Fetching Pattern

Every feature follows the same three-layer pattern:

1. **`apiClient`** (`src/lib/apiClient.js`) — thin `fetch` wrapper; sends `credentials: 'include'` so the browser attaches the HttpOnly session cookie set by the backend, handles 401 → redirect, detects `FormData` vs JSON automatically. Methods: `get`, `post`, `put`, `patch`, `delete`, `postForm`.
2. **Service modules** (e.g. `src/features/posts/services/myPostService.js`) — async functions that call `apiClient`; no state.
3. **Custom hooks** (e.g. `src/features/posts/hooks/useCreatePost.js`) — call services, own all local state (`loading`, `submitting`, `error`), show Sonner toasts, return data + handlers to pages.

Pages import hooks only; services are never called directly from components.

### Routing

All routes are declared in `src/routes/AppRouter.jsx`. Private routes are wrapped in `AdminLayout` under `/user/*`. The router uses React Router v7 (`createBrowserRouter`).

### Admin Panel Layout

`src/panel/layout/AdminLayout.jsx` drives the authenticated shell. Key non-obvious behaviour:
- Sidebar collapse state is persisted to `localStorage`.
- Editor pages (`/user/create-post`, `/user/edit-post/:id`) suppress the sidebar and topbar entirely — the editor renders full-screen inside the outlet.
- Sidebar width change triggers a CSS margin transition on the main content area.

### Rich Text Editor (TipTap v3)

The editor is composed inside `src/features/posts/components/editor/`:

| File | Role |
|---|---|
| `tiptap/editorExtensions.js` | Single source for all TipTap extensions (StarterKit, Link, TextAlign, CharacterCount, Placeholder, Underline) |
| `hooks/useTiptapEditor.js` | Initializes the editor instance, wires `onUpdate`, handles content parse/serialize |
| `hooks/useEditorState.js` | Reactive snapshot of active marks/commands; listens to `transaction` + `selectionUpdate` events |
| `tiptap/EditorToolbar.jsx` | Composes InlineControls, BlockControls, AlignControls, HistoryControls, LinkModal |
| `utils/editorContent.js` | `parseEditorContent(html)` / `serializeEditorContent(editor)` / `isEditorContentEmpty(content)` — always use these for reading/writing editor content; never access `editor.getJSON()` or `editor.getHTML()` directly outside these utilities |

Content is stored as **ProseMirror JSON** in the database; `editorContent.js` handles the HTML↔JSON conversion boundary.

### Post Validation

`src/utils/postValidation.js` exports `validatePost(post, initialStatus)`:
- `PUBLISHED` status requires title + content + categoryId.
- `DRAFT` status requires title **or** content (at least one).

Call this before any submit; it returns `{ isValid, errors[] }`.

### Image Handling

Cover images are uploaded separately from post data. `useCoverImageUpload` manages the preview + file state; the service sends a `multipart/form-data` request via `apiClient.postForm()`. `src/utils/imageUtils.js` has validation helpers. Image URLs are constructed using `BASE_URL` from `config.js` (i.e. `VITE_API_URL`).

### UI Components

shadcn/ui primitives live in `src/components/ui/`. When adding new UI, prefer composing from existing primitives there before installing new packages. Tailwind CSS 4 is used (Vite plugin, not PostCSS class-based config).
