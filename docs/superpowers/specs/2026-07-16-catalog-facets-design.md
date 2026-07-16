# Stacked Facet System for the Public Catalog — Design Spec

**Date:** 2026-07-16
**Scope:** marginalia-web (frontend) + marginalia-api (backend)
**Status:** Approved by user after brainstorming

## Context

The catalog (`/catalog`, `CatalogPage` → `PostCatalog`) currently offers two independent dropdowns — category and sort — backed by `GET /api/public/posts?categoryId=&sort=`. The goal is a **stacked facet system**: category + reading time + author + search (+ future topic), all active simultaneously, fully synced to URL query params for shareability, with a "Limpiar filtros" action. The architecture must be extensible: adding a facet later (e.g. topic) must not rewrite the filtering logic. UI stays minimalist/editorial — no filter panel.

## Decisions (user-approved)

- **Filtering stays server-side** (pagination is server-side); the backend is extended via **JPA Specifications**.
- **`word_count` is the single persisted source of truth** (not minutes): minutes are an interpretation via a constant (÷200) that must be changeable without a DB migration. One shared backend function converts words→minutes, used by BOTH the DTO mapping and the bucket range bounds. No duplicate definitions.
- Word count is recomputed **on every content change** (not just publish), derived from a **plain-text extraction of the ProseMirror JSON in a single traversal** — structured so a future persisted searchable-text column plugs into the same step.
- **Search = title + author name** (ILIKE), built as an **isolated, replaceable predicate** ready to OR-in the future plain-text column. It does NOT search post bodies today.
- **Scope: CatalogPage + CategoryPage** (category locked there); AuthorPage untouched.
- **No facet counts**; instead a smarter **empty state** that suggests removing specific active facets.
- **UI: editorial text-link facets** — filter state reads as a sentence ("Categoría: Ficción · Tiempo: un café · Autor: todos · Orden: recientes"), NOT bordered dropdowns. Discoverability via dotted underline + hover/focus affordance; ≥44px touch targets via padding; real keyboard-accessible buttons with labels and visible focus. "Limpiar filtros" unobtrusive; total result count stays.
- **Frontend: declarative facet registry** + one generic hook.

## Backend (marginalia-api)

### 1. `word_count` column + single reading-time definition
- **Flyway `V7__add_post_word_count.sql`**: `ALTER TABLE Posts ADD COLUMN word_count INT` (nullable; backfill makes it effectively always set).
- **`Post` entity**: add `wordCount` field.
- **New utility `PostPlainText`** (in `utils/`, alongside `PostContentSanitizer`): `extractPlainText(String proseMirrorJson)` — walks the JSON collecting `text` node values (mirrors frontend `editorContentToText` in `src/features/posts/utils/editorContent.js`). Word count = whitespace-split token count of that text. Single traversal; the future searchable-text column will reuse this same extraction step.
- **New utility `ReadingTime`**: holds `WORDS_PER_MINUTE = 200`; `minutesFor(wordCount) = max(1, ceil(wordCount / 200))` (same formula as `PostPage.jsx` today); also the word-range bounds used by the bucket enum. This is the ONLY place the constant lives.
- **`MyPostCommandService`**: on create and on update, whenever content is set/changed, recompute `wordCount` via `PostPlainText` → count. (Same anti-staleness criterion as existing flags — a published post edited later can never carry a stale value.)
- **Backfill**: one-time startup runner (pattern of `DataInitializer`) computing `word_count` for rows where it is NULL, using the same utilities.
- **`PublicPostResponse`**: add `readingMinutes` (derived via `ReadingTime.minutesFor`; null-safe → 1). `PostPage.jsx` and any card display consume it instead of recalculating.

### 2. Specifications refactor
- `PostRepository` extends `JpaSpecificationExecutor<Post>`.
- New `PostCatalogSpecifications` with composable predicates:
  - `isPublished()`
  - `hasCategorySlug(String slug)` — join on `category.slug`; null → no-op
  - `hasCategory(Integer categoryId)` — kept for compatibility; null → no-op
  - `hasAuthor(Integer authorId)` — null → no-op
  - `readingTimeIn(ReadingTimeBucket bucket)` — range on `word_count`; null → no-op
  - `matchesQuery(String q)` — **isolated predicate**: `ILIKE %q%` on `title` OR joined `author.name`. Self-contained so the future plain-text column ORs in without touching the facet system.
- `PublicPostQueryService.listPublishedPosts` composes non-null predicates; replaces the derived `findByStatus` / `findByCategoryIdAndStatus` catalog paths.

### 3. `ReadingTimeBucket` enum
- `SHORT` (≤ 4 min → word_count ≤ 800), `MEDIUM` (5–15 min → 801–3000), `LONG` (≥ 16 min → ≥ 3001). Bounds computed FROM `ReadingTime`'s constant, not hardcoded twice.
- Lenient `from(String)` like `PostCatalogSort.from()`: null/blank/unknown → null (no filter). Shareable URLs must never break.

### 4. Controller
- `PublicPostController.list` gains optional `category` (slug), `authorId`, `time`, `q` params. `q`: trimmed, ignored if < 2 chars, capped ~100 chars. Existing `categoryId`, `sort` (+ legacy aliases) unchanged.
- Slug-based category param means the frontend passes the URL slug straight through — no client-side slug→id lookup. Side benefit: kills the current first-render quirk where the catalog fetches unfiltered until categories load, then refetches.

### 5. New public authors endpoint
- `GET /api/public/authors` (extend `PublicAuthorController`): id + name of authors with ≥ 1 PUBLISHED post, ordered by name. Populates the author facet.

## Frontend (marginalia-web)

### URL schema (defaults omitted; unknown values ignored)
`/catalog?category=<slug>&time=short|medium|long&author=<id>&q=<text>&sort=<key>` — existing `category`/`sort` names and `LEGACY_SORTS` mapping preserved.

### 6. Facet registry — `src/features/posts/catalog/catalogFacets.js`
Each facet declared as data: `{ key, param, type: 'select'|'search', defaultValue, clearable, label, useOptions, toApiParams(value) }`.
- **`useOptions` is a hook reference owned by the entry** (static facets return constants). Options are consumed only inside the generic `FacetControl` component (one instance per facet, so hook rules hold). There is NO shared ctx assembled outside the registry — that would leak.
- **`toApiParams` is pure** (value → params object, no ctx): category passes the slug straight to the new `category` API param; author passes id; time/q pass through.
- Registry order = sentence order: Categoría · Tiempo · Autor · Orden, plus Buscar.
- `sort`: `clearable: false` ("Limpiar filtros" resets filters, not ordering); keeps `SORT_LABELS` + legacy normalization from `PostCatalog.jsx`.
- category: value = slug; options from existing `usePublicCategories`.
- time: static options (short "Un café", medium "Una pausa", long "Sobremesa").
- author: options from new `usePublicAuthors` hook + `publicAuthorService` (new, three-layer pattern) calling `/public/authors`; value = id.
- search: text facet, min 2 chars.

**Acceptance criterion (extensibility acid test):** adding a future facet (e.g. "tema") must be ONE new entry in `catalogFacets.js` — bringing its own `useOptions` hook and pure `toApiParams` — plus its backend param/specification/options endpoint. It must NOT touch `useCatalogFilters`, URL parse/serialize, the clear button, `CatalogFilterBar`/`FacetControl`, `useCatalogPosts`, or `publicPostService`. If it does, the abstraction leaked and must be fixed, not worked around.

### 7. Generic hook — `useCatalogFilters({ locked })`
Wraps `useSearchParams` + registry. Returns `{ values, setFacet(key, value), clearAll(), anyActive, apiParams }`. **Locked facets** are first-class: fixed value, excluded from URL, sentence, and `clearAll`. `CategoryPage` passes `locked: { category: slug }`; its current `lockedSort` local state is removed (sort becomes URL-synced there too).

### 8. Data plumbing
- `useCatalogPosts({ apiParams, size })` — accepts the merged params object.
- `publicPostService.getCatalog(params)` — appends params generically. Neither changes again for new facets.

### 9. UI — `CatalogFilterBar` (sentence style)
- `CatalogFilterBar` maps over the registry rendering one generic `FacetControl` per facet; `FacetControl` calls `facet.useOptions()` internally (one component instance per facet — hook-rule safe) and resolves the display label from options.
- Each select facet: real `<button>` = Radix `DropdownMenuTrigger` (keyboard nav for free) rendering `Categoría: Ficción` as plain text; **dotted underline** under the value, hover → solid/rose shift, `cursor-pointer`, visible `focus-visible` ring, padding for **≥ 44px effective touch target**; `aria-label` like "Filtrar por categoría, actual: Ficción".
- Search: labeled inline input ("Buscar:") in the same editorial underline style; **debounced ~350 ms**; URL updates with `replace: true` (no history spam). Debounce also respects the API rate-limit budget.
- "Limpiar filtros": quiet text button, only when `anyActive`.
- Result count ("N publicaciones") unchanged. Sentence wraps naturally on mobile.
- `PostCatalog.jsx` slims down to: filters hook + filter bar + grid + load-more + states.

### 10. Empty state
Zero results with active filters → current message plus a "quitar" action per active facet and "Limpiar filtros".

## Files touched (main)
- API: `V7__add_post_word_count.sql`, `Post.java`, `PostRepository.java`, new `PostCatalogSpecifications.java`, new `ReadingTime.java`, new `PostPlainText.java`, new `ReadingTimeBucket.java`, `PublicPostQueryService.java`, `PublicPostController.java`, `PublicAuthorController.java` + `PublicAuthorService.java`, `MyPostCommandService.java`, `PublicPostResponse.java`, backfill runner.
- Web: new `catalog/catalogFacets.js`, new `useCatalogFilters.js`, new `CatalogFilterBar.jsx` + `FacetControl.jsx`, new `usePublicAuthors.js` + `publicAuthorService.js`, edits to `PostCatalog.jsx`, `useCatalogPosts.js`, `publicPostService.js`, `CategoryPage.jsx`, `PostPage.jsx` (consume `readingMinutes`).

## Verification
- **Backend tests**: `ReadingTime` boundary tests (800 → 4 min/SHORT edge, 3000/3001 MEDIUM↔LONG edge); `PostPlainText` extraction vs known ProseMirror fixtures; specification stacking (category+time+author+q combined); controller tests in `PublicPostControllerTest` style incl. lenient unknown `time`, short/overlong `q`; backfill fills NULLs; authors endpoint returns only authors with published posts.
- **Frontend tests (Vitest)**: registry URL parse/serialize round-trip; `useCatalogFilters` (setFacet/clearAll/anyActive/locked); `PostCatalog` integration (stacked facets → combined service params, clear button, empty-state suggestions); `publicAuthorService` test; **extensibility acid test** — a test that registers a synthetic extra facet and asserts URL sync, apiParams, clear, and sentence rendering all work with zero changes outside the registry.
- **End-to-end**: via the `marginalia-web:verify` flow — apply several facets, confirm URL reflects state, reload/share URL restores filters, clear filters works, CategoryPage inherits facets with category locked, reading time shows on PostPage from API.
