# Stacked Catalog Facet System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the catalog's two independent dropdowns with a stacked facet system (category + reading time + author + search + sort, all simultaneous), URL-synced, with "Limpiar filtros", extensible via a declarative registry.

**Architecture:** Backend gains a persisted `word_count` column (single source of truth; minutes derived at the edge by one shared `ReadingTime` utility) and a JPA-Specifications catalog query with one composable predicate per facet. Frontend gains a declarative facet registry (`catalogFacets.js`) consumed by one generic hook (`useCatalogFilters`) and one generic sentence-style UI (`CatalogFilterBar`/`FacetControl`).

**Tech Stack:** Spring Boot 3.5.15 / Java 21 / Flyway / JPA Specifications / JUnit+MockMvc+H2 (backend); React 19 / React Router v7 / Tailwind 4 / Radix (shadcn) / Vitest + Testing Library (frontend).

**Spec:** `marginalia-web/docs/superpowers/specs/2026-07-16-catalog-facets-design.md`

## Global Constraints

- **Two git repos.** Tasks 1–9 run in `C:\repos\BlogProyecto\marginalia-api`; Tasks 10–18 in `C:\repos\BlogProyecto\marginalia-web`. Work on branch `feature/catalog-facets` in BOTH (create in marginalia-api in Task 1; it already exists in marginalia-web).
- **Single reading-time definition:** the constant 200 words/min lives ONLY in `ReadingTime.java`. Bucket bounds and DTO minutes both derive from it. Never write `200`, `800`, or `3000` anywhere else in the backend.
- **Bucket semantics:** short = ≤ 4 min (word_count ≤ 800), medium = 5–15 min (801–3000), long = ≥ 16 min (≥ 3001).
- **`q` searches title + author name ONLY.** Do not search post content/body.
- **Lenient URL params:** unknown/blank `time`, `sort` values fall back silently (no 400) — these live in shareable URLs.
- **Legacy compatibility:** keep `categoryId` API param and `LEGACY_SORTS` URL aliases working.
- **Extensibility acceptance criterion:** adding a facet = one entry in `catalogFacets.js` (+ its backend param). If it forces edits to `useCatalogFilters`, `CatalogFilterBar`, `FacetControl`, `useCatalogPosts`, or `publicPostService`, the abstraction leaked — fix the abstraction.
- **UI copy is Spanish**, matching existing tone (e.g. "Limpiar filtros", "Un café", "Una pausa", "Sobremesa", "Todas las categorias", "Todos los autores").
- Backend tests: `cd C:\repos\BlogProyecto\marginalia-api && .\mvnw.cmd test -Dtest=<ClassName>`. Frontend: `cd C:\repos\BlogProyecto\marginalia-web && npm run test`.

---

### Task 1: `ReadingTime` utility (backend)

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/utils/ReadingTime.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/utils/ReadingTimeTest.java`

**Interfaces:**
- Produces: `ReadingTime.WORDS_PER_MINUTE` (int, 200), `ReadingTime.minutesFor(Integer wordCount)` → int (≥1, null-safe), `ReadingTime.maxWordsFor(int minutes)` → int. Used by Tasks 5, 6.

- [ ] **Step 1: Create branch in marginalia-api**

```bash
cd C:/repos/BlogProyecto/marginalia-api
git checkout -b feature/catalog-facets
```

- [ ] **Step 2: Write the failing test**

```java
package com.blog.blog_literario.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ReadingTimeTest {

    @Test
    void minutesFor_null_returnsOneMinuteFloor() {
        assertThat(ReadingTime.minutesFor(null)).isEqualTo(1);
    }

    @Test
    void minutesFor_zeroWords_returnsOneMinuteFloor() {
        assertThat(ReadingTime.minutesFor(0)).isEqualTo(1);
    }

    @Test
    void minutesFor_roundsUpPartialMinutes() {
        assertThat(ReadingTime.minutesFor(201)).isEqualTo(2);
    }

    @Test
    void minutesFor_exactMultiple_isExact() {
        // 800 words at 200 wpm = exactly 4 minutes (the SHORT bucket edge)
        assertThat(ReadingTime.minutesFor(800)).isEqualTo(4);
        assertThat(ReadingTime.minutesFor(3000)).isEqualTo(15);
    }

    @Test
    void minutesFor_oneWordPastTheEdge_crossesToNextMinute() {
        assertThat(ReadingTime.minutesFor(801)).isEqualTo(5);
        assertThat(ReadingTime.minutesFor(3001)).isEqualTo(16);
    }

    @Test
    void maxWordsFor_isTheInverseBoundary() {
        assertThat(ReadingTime.maxWordsFor(4)).isEqualTo(800);
        assertThat(ReadingTime.maxWordsFor(15)).isEqualTo(3000);
    }
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=ReadingTimeTest`
Expected: COMPILATION ERROR — `ReadingTime` does not exist.

- [ ] **Step 4: Write the implementation**

```java
package com.blog.blog_literario.utils;

/**
 * Single source of truth for the words→minutes reading-time interpretation.
 *
 * <p>{@code word_count} is the persisted fact on {@link com.blog.blog_literario.model.Post};
 * minutes are derived here (÷{@value #WORDS_PER_MINUTE}, rounded up, floor 1 — the same
 * formula the frontend used before this moved server-side). Both the public DTO mapping
 * and the {@link com.blog.blog_literario.dto.posts.ReadingTimeBucket} range bounds MUST
 * go through this class so the constant can change without touching stored data.
 */
public final class ReadingTime {

    public static final int WORDS_PER_MINUTE = 200;

    private ReadingTime() {
    }

    /** Minutes of reading for a word count; null or non-positive counts as the 1-minute floor. */
    public static int minutesFor(Integer wordCount) {
        if (wordCount == null || wordCount <= 0) {
            return 1;
        }
        return Math.max(1, (int) Math.ceil((double) wordCount / WORDS_PER_MINUTE));
    }

    /** Largest word count that still reads in {@code minutes} minutes; used for bucket bounds. */
    public static int maxWordsFor(int minutes) {
        return minutes * WORDS_PER_MINUTE;
    }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=ReadingTimeTest`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/blog/blog_literario/utils/ReadingTime.java src/test/java/com/blog/blog_literario/utils/ReadingTimeTest.java
git commit -m "feat: add ReadingTime utility - single words-to-minutes definition"
```

---

### Task 2: `PostPlainText` utility (backend)

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/utils/PostPlainText.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/utils/PostPlainTextTest.java`

**Interfaces:**
- Produces: `PostPlainText.extractPlainText(String proseMirrorJson)` → String (never null), `PostPlainText.countWords(String plainText)` → int. Used by Tasks 3, 4. The extraction is the single traversal a future searchable-text column will also feed from.

- [ ] **Step 1: Write the failing test**

Mirror the frontend semantics of `editorContentToText` in `marginalia-web/src/features/posts/utils/editorContent.js` (join text nodes with spaces, collapse whitespace, trim).

```java
package com.blog.blog_literario.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PostPlainTextTest {

    private static final String DOC = """
            {"type":"doc","content":[
              {"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"El otoño"}]},
              {"type":"paragraph","content":[
                {"type":"text","text":"Las hojas caen "},
                {"type":"text","marks":[{"type":"bold"}],"text":"lentamente"}
              ]},
              {"type":"paragraph"}
            ]}
            """;

    @Test
    void extractPlainText_walksTextNodesJoiningWithSpaces() {
        assertThat(PostPlainText.extractPlainText(DOC))
                .isEqualTo("El otoño Las hojas caen lentamente");
    }

    @Test
    void extractPlainText_nullOrBlank_returnsEmptyString() {
        assertThat(PostPlainText.extractPlainText(null)).isEmpty();
        assertThat(PostPlainText.extractPlainText("  ")).isEmpty();
    }

    @Test
    void extractPlainText_invalidJson_returnsEmptyStringInsteadOfThrowing() {
        assertThat(PostPlainText.extractPlainText("not json")).isEmpty();
    }

    @Test
    void countWords_splitsOnWhitespace() {
        assertThat(PostPlainText.countWords("El otoño Las hojas caen lentamente")).isEqualTo(6);
    }

    @Test
    void countWords_emptyOrNull_isZero() {
        assertThat(PostPlainText.countWords("")).isZero();
        assertThat(PostPlainText.countWords(null)).isZero();
        assertThat(PostPlainText.countWords("   ")).isZero();
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=PostPlainTextTest`
Expected: COMPILATION ERROR — `PostPlainText` does not exist.

- [ ] **Step 3: Write the implementation**

```java
package com.blog.blog_literario.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Extracts the readable plain text of a TipTap/ProseMirror JSON document.
 *
 * <p>Mirrors the frontend's {@code editorContentToText} (editorContent.js): text nodes
 * joined with spaces, whitespace collapsed, trimmed. This single traversal is the source
 * for {@code word_count} today and is where a future persisted searchable-text column
 * must be produced too — one walk, all derivations.
 */
public final class PostPlainText {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private PostPlainText() {
    }

    /** Never returns null; unparseable or blank content yields the empty string. */
    public static String extractPlainText(String content) {
        if (content == null || content.isBlank()) {
            return "";
        }
        JsonNode root;
        try {
            root = MAPPER.readTree(content);
        } catch (JsonProcessingException e) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        walk(root, sb);
        return sb.toString().replaceAll("\\s+", " ").trim();
    }

    public static int countWords(String plainText) {
        if (plainText == null || plainText.isBlank()) {
            return 0;
        }
        return plainText.trim().split("\\s+").length;
    }

    private static void walk(JsonNode node, StringBuilder sb) {
        if (node.hasNonNull("text")) {
            sb.append(node.get("text").asText()).append(' ');
        }
        JsonNode children = node.get("content");
        if (children != null && children.isArray()) {
            for (JsonNode child : children) {
                walk(child, sb);
            }
        }
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=PostPlainTextTest`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/blog/blog_literario/utils/PostPlainText.java src/test/java/com/blog/blog_literario/utils/PostPlainTextTest.java
git commit -m "feat: add PostPlainText - single-traversal plain text extraction from ProseMirror JSON"
```

---

### Task 3: `word_count` column, entity field, recompute on every content change

**Files:**
- Create: `marginalia-api/src/main/resources/db/migration/V7__add_post_word_count.sql`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/model/Post.java` (add field near `featured`, ~line 79)
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/services/posts/MyPostCommandService.java` (`create` ~line 107, `update` ~line 163)
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/services/posts/MyPostCommandServiceWordCountTest.java`

**Interfaces:**
- Consumes: `PostPlainText.extractPlainText` / `countWords` (Task 2).
- Produces: `Post.getWordCount()` / `setWordCount(Integer)`; `word_count` column. Used by Tasks 4–7.

- [ ] **Step 1: Write the migration**

```sql
-- Persisted word count of the post content (the fact; reading minutes are derived in
-- code via ReadingTime so the words-per-minute constant can change without a migration).
-- Nullable: existing rows are backfilled by WordCountBackfill on next startup.
alter table posts add column word_count int;
```

- [ ] **Step 2: Add the entity field**

In `Post.java`, after the `featured` field:

```java
    /**
     * Word count of the plain text extracted from {@code content}. The persisted fact
     * behind reading time; minutes are always derived via {@link com.blog.blog_literario.utils.ReadingTime}.
     * Recomputed by the service layer on every content change so it can never go stale.
     * Nullable only for rows created before V7 that the startup backfill hasn't visited yet.
     */
    @Column(name = "word_count")
    private Integer wordCount;
```

- [ ] **Step 3: Write the failing service test**

```java
package com.blog.blog_literario.services.posts;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.Optional;

import com.blog.blog_literario.dto.posts.CreatePostRequest;
import com.blog.blog_literario.dto.posts.UpdatePostRequest;
import com.blog.blog_literario.model.Post;
import com.blog.blog_literario.model.PostStatus;
import com.blog.blog_literario.model.User;
import com.blog.blog_literario.repositories.CategoryRepository;
import com.blog.blog_literario.repositories.PostRepository;
import com.blog.blog_literario.repositories.UserRepository;
import com.blog.blog_literario.services.images.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MyPostCommandServiceWordCountTest {

    @Mock StorageService storageService;
    @Mock PostRepository postRepository;
    @Mock UserRepository userRepository;
    @Mock CategoryRepository categoryRepository;
    @InjectMocks MyPostCommandService service;

    // 6 words of prose inside a valid TipTap doc
    private static final String SIX_WORD_DOC =
            "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":"
            + "[{\"type\":\"text\",\"text\":\"uno dos tres cuatro cinco seis\"}]}]}";

    @Test
    void create_setsWordCountFromContent() {
        User user = new User();
        user.setId(1);
        user.setName("Alice");
        given(userRepository.findById(1)).willReturn(Optional.of(user));

        CreatePostRequest request = new CreatePostRequest(
                "Un titulo valido", SIX_WORD_DOC, "DRAFT", null, null, null);

        service.create(1, request);

        ArgumentCaptor<Post> saved = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(saved.capture());
        assertThat(saved.getValue().getWordCount()).isEqualTo(6);
    }

    @Test
    void update_recomputesWordCountWhenContentChanges() {
        User user = new User();
        user.setId(1);
        user.setName("Alice");
        Post existing = new Post("Viejo titulo largo", "{\"type\":\"doc\",\"content\":[]}",
                PostStatus.DRAFT, "viejo-titulo-largo", user, null);
        existing.setWordCount(99);
        given(postRepository.findByIdAndAuthorId(5, 1)).willReturn(Optional.of(existing));
        given(postRepository.existsBySlugAndIdNot(any(), any())).willReturn(false);

        UpdatePostRequest request = new UpdatePostRequest(
                "Nuevo titulo largo", SIX_WORD_DOC, "DRAFT", null, null, null);

        service.update(1, 5, request);

        assertThat(existing.getWordCount()).isEqualTo(6);
    }
}
```

**Note:** `CreatePostRequest` / `UpdatePostRequest` are records — open both DTOs first and match the component order exactly (title, content, status, categoryId, focalX, focalY or as actually declared). Adjust the constructor calls above if the order differs; that is the only permitted deviation.

- [ ] **Step 4: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=MyPostCommandServiceWordCountTest`
Expected: FAIL — wordCount is null (never set), assertions on 6 fail.

- [ ] **Step 5: Implement the recompute in `MyPostCommandService`**

Add import `com.blog.blog_literario.utils.PostPlainText`.

In `create` (currently ~line 107), the sanitized content is passed inline. Restructure to reuse it:

```java
        String sanitizedContent = PostContentSanitizer.sanitize(request.content());

        Post post = new Post(
                request.title(),
                sanitizedContent,
                status,
                slug,
                user,
                category
        );
        // word_count is derived from the same single plain-text extraction the future
        // searchable-text column will use; recomputed on every content change (never stale).
        post.setWordCount(PostPlainText.countWords(PostPlainText.extractPlainText(sanitizedContent)));
```

In `update` (currently line 162–163), replace:

```java
        post.setTitle(request.title());
        post.setContent(PostContentSanitizer.sanitize(request.content()));
```

with:

```java
        post.setTitle(request.title());
        String sanitizedContent = PostContentSanitizer.sanitize(request.content());
        post.setContent(sanitizedContent);
        post.setWordCount(PostPlainText.countWords(PostPlainText.extractPlainText(sanitizedContent)));
```

- [ ] **Step 6: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=MyPostCommandServiceWordCountTest`
Expected: PASS (2 tests).

- [ ] **Step 7: Run the full backend suite (entity + migration sanity)**

Run: `.\mvnw.cmd test`
Expected: PASS — H2 tests use `ddl-auto=create-drop` so the new column materializes from the entity; Flyway V7 is validated at real startup, not in tests.

- [ ] **Step 8: Commit**

```bash
git add src/main/resources/db/migration/V7__add_post_word_count.sql src/main/java/com/blog/blog_literario/model/Post.java src/main/java/com/blog/blog_literario/services/posts/MyPostCommandService.java src/test/java/com/blog/blog_literario/services/posts/MyPostCommandServiceWordCountTest.java
git commit -m "feat: persist word_count on posts, recomputed on every content change"
```

---

### Task 4: Word-count backfill runner

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/config/WordCountBackfill.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/repositories/PostRepository.java` (add one derived method)
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/config/WordCountBackfillTest.java`

**Interfaces:**
- Consumes: `PostPlainText` (Task 2), `Post.setWordCount` (Task 3).
- Produces: `postRepository.findByWordCountIsNull()` → `List<Post>`; startup runner that fills NULL word counts.

- [ ] **Step 1: Add the repository method**

In `PostRepository.java`:

```java
    /** Rows created before V7 whose word_count the startup backfill hasn't computed yet. */
    List<Post> findByWordCountIsNull();
```

- [ ] **Step 2: Write the failing test**

```java
package com.blog.blog_literario.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import java.util.List;

import com.blog.blog_literario.model.Post;
import com.blog.blog_literario.model.PostStatus;
import com.blog.blog_literario.repositories.PostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WordCountBackfillTest {

    @Mock PostRepository postRepository;
    @InjectMocks WordCountBackfill backfill;

    @Test
    void run_computesWordCountForPendingRowsUsingTheSharedExtraction() throws Exception {
        Post pending = new Post("Titulo cualquiera",
                "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":"
                + "[{\"type\":\"text\",\"text\":\"uno dos tres\"}]}]}",
                PostStatus.PUBLISHED, "titulo-cualquiera", null, null);
        given(postRepository.findByWordCountIsNull()).willReturn(List.of(pending));

        backfill.run();

        assertThat(pending.getWordCount()).isEqualTo(3);
        verify(postRepository).saveAll(List.of(pending));
    }

    @Test
    void run_nothingPending_savesNothing() throws Exception {
        given(postRepository.findByWordCountIsNull()).willReturn(List.of());

        backfill.run();

        verify(postRepository, org.mockito.Mockito.never()).saveAll(org.mockito.ArgumentMatchers.anyList());
    }
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=WordCountBackfillTest`
Expected: COMPILATION ERROR — `WordCountBackfill` does not exist.

- [ ] **Step 4: Write the implementation**

```java
package com.blog.blog_literario.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.blog.blog_literario.model.Post;
import com.blog.blog_literario.repositories.PostRepository;
import com.blog.blog_literario.utils.PostPlainText;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * One-time backfill of {@code word_count} for posts created before migration V7.
 *
 * <p>Uses the exact same extraction as the write path ({@link PostPlainText}) so
 * backfilled rows and newly saved rows can never disagree. Idempotent: only rows
 * with a NULL word_count are visited, so after the first successful run this is a no-op.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WordCountBackfill implements CommandLineRunner {

    private final PostRepository postRepository;

    @Override
    @Transactional
    public void run(String... args) {
        List<Post> pending = postRepository.findByWordCountIsNull();
        if (pending.isEmpty()) {
            log.debug("WordCountBackfill: nothing to backfill");
            return;
        }
        for (Post post : pending) {
            post.setWordCount(PostPlainText.countWords(PostPlainText.extractPlainText(post.getContent())));
        }
        postRepository.saveAll(pending);
        log.info("WordCountBackfill: computed word_count for {} posts", pending.size());
    }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=WordCountBackfillTest`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/blog/blog_literario/config/WordCountBackfill.java src/main/java/com/blog/blog_literario/repositories/PostRepository.java src/test/java/com/blog/blog_literario/config/WordCountBackfillTest.java
git commit -m "feat: backfill word_count for pre-existing posts on startup"
```

---

### Task 5: `ReadingTimeBucket` enum

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/dto/posts/ReadingTimeBucket.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/dto/posts/ReadingTimeBucketTest.java`

**Interfaces:**
- Consumes: `ReadingTime.maxWordsFor` (Task 1).
- Produces: `ReadingTimeBucket.SHORT|MEDIUM|LONG`, `minWords()` → int, `maxWords()` → Integer (null = unbounded), `from(String)` → bucket or null. Used by Tasks 7, 8.

- [ ] **Step 1: Write the failing test**

```java
package com.blog.blog_literario.dto.posts;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ReadingTimeBucketTest {

    @Test
    void bucketBoundsDeriveFromTheSharedReadingTimeConstant() {
        assertThat(ReadingTimeBucket.SHORT.minWords()).isEqualTo(0);
        assertThat(ReadingTimeBucket.SHORT.maxWords()).isEqualTo(800);
        assertThat(ReadingTimeBucket.MEDIUM.minWords()).isEqualTo(801);
        assertThat(ReadingTimeBucket.MEDIUM.maxWords()).isEqualTo(3000);
        assertThat(ReadingTimeBucket.LONG.minWords()).isEqualTo(3001);
        assertThat(ReadingTimeBucket.LONG.maxWords()).isNull();
    }

    @Test
    void from_knownKeysCaseInsensitive() {
        assertThat(ReadingTimeBucket.from("short")).isEqualTo(ReadingTimeBucket.SHORT);
        assertThat(ReadingTimeBucket.from("MEDIUM")).isEqualTo(ReadingTimeBucket.MEDIUM);
        assertThat(ReadingTimeBucket.from(" Long ")).isEqualTo(ReadingTimeBucket.LONG);
    }

    @Test
    void from_nullBlankOrUnknown_returnsNullMeaningNoFilter() {
        assertThat(ReadingTimeBucket.from(null)).isNull();
        assertThat(ReadingTimeBucket.from("  ")).isNull();
        assertThat(ReadingTimeBucket.from("bogus")).isNull();
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=ReadingTimeBucketTest`
Expected: COMPILATION ERROR — `ReadingTimeBucket` does not exist.

- [ ] **Step 3: Write the implementation**

```java
package com.blog.blog_literario.dto.posts;

import java.util.Locale;

import com.blog.blog_literario.utils.ReadingTime;

/**
 * Reading-time facet buckets for the public catalog ({@code GET /api/public/posts?time=...}).
 *
 * <p>Buckets are ranges over the persisted {@code word_count} column; the bounds are
 * computed from {@link ReadingTime}'s single words-per-minute constant so the "minutes"
 * shown to readers and the ranges used for filtering can never diverge.
 * Editorial framing: short = "Un café" (≤4 min), medium = "Una pausa" (5–15 min),
 * long = "Sobremesa" (≥16 min).
 */
public enum ReadingTimeBucket {
    SHORT(0, ReadingTime.maxWordsFor(4)),
    MEDIUM(ReadingTime.maxWordsFor(4) + 1, ReadingTime.maxWordsFor(15)),
    LONG(ReadingTime.maxWordsFor(15) + 1, null);

    private final int minWords;
    private final Integer maxWords;

    ReadingTimeBucket(int minWords, Integer maxWords) {
        this.minWords = minWords;
        this.maxWords = maxWords;
    }

    public int minWords() {
        return minWords;
    }

    /** Upper bound in words, or {@code null} for the unbounded LONG bucket. */
    public Integer maxWords() {
        return maxWords;
    }

    /**
     * Resolves a query-string value (case-insensitive) to a bucket. {@code null}, blank,
     * or unknown values return {@code null} — meaning "no reading-time filter" — instead
     * of failing, because these keys live in shareable URLs.
     */
    public static ReadingTimeBucket from(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }
        try {
            return valueOf(key.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=ReadingTimeBucketTest`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/blog/blog_literario/dto/posts/ReadingTimeBucket.java src/test/java/com/blog/blog_literario/dto/posts/ReadingTimeBucketTest.java
git commit -m "feat: add ReadingTimeBucket with bounds derived from ReadingTime"
```

---

### Task 6: Expose `readingMinutes` in `PublicPostResponse`

**Files:**
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/dto/posts/PublicPostResponse.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/services/posts/PublicPostQueryService.java` (`toResponse`, ~line 77)
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/services/users/PublicAuthorService.java` (`toPostResponse`, ~line 70)
- Modify: `marginalia-api/src/test/java/com/blog/blog_literario/controllers/posts/PublicPostControllerTest.java` (SAMPLE_POST, ~line 46)

**Interfaces:**
- Consumes: `ReadingTime.minutesFor` (Task 1), `Post.getWordCount()` (Task 3).
- Produces: `PublicPostResponse.readingMinutes` (int) as the last record component. Frontend consumes it in Task 16.

- [ ] **Step 1: Extend the failing controller test**

Add to `PublicPostControllerTest.list_noAuth_returns200WithPage()`:

```java
                .andExpect(jsonPath("$.content[0].readingMinutes").value(3));
```

and change `SAMPLE_POST` to end with `false, 3`:

```java
    private static final PublicPostResponse SAMPLE_POST = new PublicPostResponse(
            "Spring Boot Guide", "Content here", "spring-boot-guide",
            1, "Alice", "Author bio", null,
            "Technology", "technology", null,
            new java.math.BigDecimal("0.25"), new java.math.BigDecimal("0.75"),
            LocalDateTime.now(), false, 3);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=PublicPostControllerTest`
Expected: COMPILATION ERROR — constructor arity mismatch.

- [ ] **Step 3: Add the record component and map it**

`PublicPostResponse.java` — add as the final component:

```java
        LocalDateTime createdAt,
        boolean featured,
        int readingMinutes
```

`PublicPostQueryService.toResponse` — add as the final constructor argument:

```java
                post.isFeatured(),
                ReadingTime.minutesFor(post.getWordCount())
```

with import `com.blog.blog_literario.utils.ReadingTime`. Make the **identical** change in `PublicAuthorService.toPostResponse` (it builds the same record). Then run a project-wide search for any other constructor call sites:

Run: `grep -rn "new PublicPostResponse" src/` — fix every hit the same way (tests pass a literal minutes value).

- [ ] **Step 4: Run test to verify it passes**

Run: `.\mvnw.cmd test`
Expected: PASS — full suite, since the record change ripples into every call site.

- [ ] **Step 5: Commit**

```bash
git add -A src/
git commit -m "feat: expose readingMinutes in public post responses via ReadingTime"
```

---

### Task 7: `PostCatalogSpecifications` + repository executor

**Files:**
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/repositories/PostRepository.java` (extend `JpaSpecificationExecutor<Post>`)
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/repositories/PostCatalogSpecifications.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/repositories/PostCatalogSpecificationsTest.java`

**Interfaces:**
- Consumes: `ReadingTimeBucket` (Task 5), `Post.wordCount` (Task 3).
- Produces: static `Specification<Post>` factories: `isPublished()`, `hasCategorySlug(String)`, `hasCategory(Integer)`, `hasAuthor(Integer)`, `readingTimeIn(ReadingTimeBucket)`, `matchesQuery(String)` — each returning `null` for null/blank input (skipped by `Specification.allOf`). Used by Task 8.

- [ ] **Step 1: Extend the repository**

```java
public interface PostRepository extends JpaRepository<Post, Integer>, JpaSpecificationExecutor<Post> {
```

with import `org.springframework.data.jpa.repository.JpaSpecificationExecutor`.

- [ ] **Step 2: Write the failing `@DataJpaTest`**

This is the test that proves facets STACK. It persists two authors, two categories, and four posts spanning the buckets, then filters with combined specifications. **Open `User.java` and `Category.java` first** and match their required (non-null) fields in the helpers; the intent of each helper is fixed, only setter details may be adjusted.

```java
package com.blog.blog_literario.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.blog.blog_literario.dto.posts.ReadingTimeBucket;
import com.blog.blog_literario.model.Category;
import com.blog.blog_literario.model.Post;
import com.blog.blog_literario.model.PostStatus;
import com.blog.blog_literario.model.Role;
import com.blog.blog_literario.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
class PostCatalogSpecificationsTest {

    @Autowired TestEntityManager em;
    @Autowired PostRepository postRepository;

    private User alice;
    private User bruno;
    private Category ficcion;
    private Category poesia;

    @BeforeEach
    void seed() {
        Role reader = em.persist(new Role(Role.READER));
        alice = em.persist(user("Alice Munro", "alice@example.com", reader));
        bruno = em.persist(user("Bruno Schulz", "bruno@example.com", reader));
        ficcion = em.persist(category("Ficción", "ficcion"));
        poesia = em.persist(category("Poesía", "poesia"));

        // slug, author, category, status, wordCount
        post("cafe-corto", alice, ficcion, PostStatus.PUBLISHED, 500);      // SHORT
        post("pausa-media", alice, poesia, PostStatus.PUBLISHED, 801);     // MEDIUM lower edge
        post("sobremesa-larga", bruno, ficcion, PostStatus.PUBLISHED, 3001); // LONG lower edge
        post("borrador-oculto", alice, ficcion, PostStatus.DRAFT, 100);    // never visible
        em.flush();
    }

    @Test
    void isPublished_excludesDrafts() {
        List<Post> result = postRepository.findAll(
                Specification.allOf(PostCatalogSpecifications.isPublished()));
        assertThat(result).extracting(Post::getSlug)
                .containsExactlyInAnyOrder("cafe-corto", "pausa-media", "sobremesa-larga");
    }

    @Test
    void facetsStack_categoryPlusTimePlusAuthor() {
        List<Post> result = postRepository.findAll(Specification.allOf(
                PostCatalogSpecifications.isPublished(),
                PostCatalogSpecifications.hasCategorySlug("ficcion"),
                PostCatalogSpecifications.readingTimeIn(ReadingTimeBucket.LONG),
                PostCatalogSpecifications.hasAuthor(bruno.getId())));
        assertThat(result).extracting(Post::getSlug).containsExactly("sobremesa-larga");
    }

    @Test
    void readingTimeBuckets_partitionOnExactWordEdges() {
        assertThat(published(PostCatalogSpecifications.readingTimeIn(ReadingTimeBucket.SHORT)))
                .containsExactly("cafe-corto");
        assertThat(published(PostCatalogSpecifications.readingTimeIn(ReadingTimeBucket.MEDIUM)))
                .containsExactly("pausa-media");
        assertThat(published(PostCatalogSpecifications.readingTimeIn(ReadingTimeBucket.LONG)))
                .containsExactly("sobremesa-larga");
    }

    @Test
    void matchesQuery_hitsTitleOrAuthorNameCaseInsensitive() {
        // "bruno" matches the author name of sobremesa-larga, not any title
        assertThat(published(PostCatalogSpecifications.matchesQuery("BRUNO")))
                .containsExactly("sobremesa-larga");
        // "pausa" matches a title
        assertThat(published(PostCatalogSpecifications.matchesQuery("pausa")))
                .containsExactly("pausa-media");
    }

    @Test
    void nullInputs_meanNoFilter() {
        assertThat(PostCatalogSpecifications.hasCategorySlug(null)).isNull();
        assertThat(PostCatalogSpecifications.hasCategorySlug("  ")).isNull();
        assertThat(PostCatalogSpecifications.hasCategory(null)).isNull();
        assertThat(PostCatalogSpecifications.hasAuthor(null)).isNull();
        assertThat(PostCatalogSpecifications.readingTimeIn(null)).isNull();
        assertThat(PostCatalogSpecifications.matchesQuery(null)).isNull();
        assertThat(PostCatalogSpecifications.matchesQuery(" ")).isNull();
    }

    private List<String> published(Specification<Post> facet) {
        return postRepository.findAll(
                        Specification.allOf(PostCatalogSpecifications.isPublished(), facet))
                .stream().map(Post::getSlug).toList();
    }

    private User user(String name, String email, Role role) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword("x");
        u.setRole(role);
        u.setEmailVerified(true);
        return u;
    }

    private Category category(String name, String slug) {
        Category c = new Category();
        c.setName(name);
        c.setSlug(slug);
        return c;
    }

    private Post post(String slug, User author, Category cat, PostStatus status, int words) {
        Post p = new Post("Titulo " + slug, "{\"type\":\"doc\",\"content\":[]}", status, slug, author, cat);
        p.setWordCount(words);
        return em.persist(p);
    }
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=PostCatalogSpecificationsTest`
Expected: COMPILATION ERROR — `PostCatalogSpecifications` does not exist.

- [ ] **Step 4: Write the implementation**

```java
package com.blog.blog_literario.repositories;

import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.blog.blog_literario.dto.posts.ReadingTimeBucket;
import com.blog.blog_literario.model.Post;
import com.blog.blog_literario.model.PostStatus;

/**
 * Composable predicates for the public catalog — one per facet, designed to stack.
 *
 * <p>Every factory returns {@code null} for a null/blank input, and callers combine them
 * with {@link Specification#allOf}, which skips nulls: an absent facet simply doesn't
 * constrain the query. Adding a catalog facet means adding ONE factory here plus its
 * request parameter — nothing else in the query path changes.
 */
public final class PostCatalogSpecifications {

    private PostCatalogSpecifications() {
    }

    /**
     * Base predicate for every catalog query. Also fetch-joins author and category on
     * result queries (not count queries) to keep the DTO mapping free of N+1 selects,
     * matching what {@code @EntityGraph} did on the old derived methods.
     */
    public static Specification<Post> isPublished() {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("author");
                root.fetch("category");
            }
            return cb.equal(root.get("status"), PostStatus.PUBLISHED);
        };
    }

    public static Specification<Post> hasCategorySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("category").get("slug"), slug.trim());
    }

    /** Legacy id-based filter; kept so pre-existing API clients don't break. */
    public static Specification<Post> hasCategory(Integer categoryId) {
        if (categoryId == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Post> hasAuthor(Integer authorId) {
        if (authorId == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("author").get("id"), authorId);
    }

    /** Range over the persisted {@code word_count}; bounds come from the bucket (single definition). */
    public static Specification<Post> readingTimeIn(ReadingTimeBucket bucket) {
        if (bucket == null) {
            return null;
        }
        return (root, query, cb) -> {
            var words = root.<Integer>get("wordCount");
            if (bucket.maxWords() == null) {
                return cb.greaterThanOrEqualTo(words, bucket.minWords());
            }
            return cb.between(words, bucket.minWords(), bucket.maxWords());
        };
    }

    /**
     * Search predicate — deliberately isolated and replaceable. Today it matches title
     * OR author name (case-insensitive substring). When a persisted plain-text content
     * column exists, it joins this OR as another source; nothing outside this method changes.
     */
    public static Specification<Post> matchesQuery(String q) {
        if (q == null || q.isBlank()) {
            return null;
        }
        String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("author").get("name")), pattern));
    }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=PostCatalogSpecificationsTest`
Expected: PASS (5 tests). If `root.fetch` collides with the count query, the guard in `isPublished()` is wrong — fix the guard, don't remove the fetch.

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/blog/blog_literario/repositories/ src/test/java/com/blog/blog_literario/repositories/PostCatalogSpecificationsTest.java
git commit -m "feat: add stackable JPA specifications for the public catalog"
```

---

### Task 8: `PostCatalogFilter`, service refactor, controller params

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/dto/posts/PostCatalogFilter.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/services/posts/PublicPostQueryService.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/controllers/posts/PublicPostController.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/controllers/posts/PublicPostControllerTest.java` (extend)
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/dto/posts/PostCatalogFilterTest.java`

**Interfaces:**
- Consumes: `PostCatalogSpecifications` (Task 7), `ReadingTimeBucket.from` (Task 5), `PostCatalogSort` (existing).
- Produces: `PostCatalogFilter(String categorySlug, Integer categoryId, Integer authorId, ReadingTimeBucket time, String q)` record with factory `PostCatalogFilter.of(String category, Integer categoryId, Integer authorId, String time, String q)`; service signature `listPublishedPosts(PostCatalogFilter, PostCatalogSort, Pageable)`. The API contract Task 13's frontend service targets: `GET /api/public/posts?category=&authorId=&time=&q=&sort=&page=&size=`.

- [ ] **Step 1: Write the failing filter test**

```java
package com.blog.blog_literario.dto.posts;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PostCatalogFilterTest {

    @Test
    void of_normalizesQ_trimsAndDropsShortOrOverlongValues() {
        assertThat(PostCatalogFilter.of(null, null, null, null, "  borges  ").q()).isEqualTo("borges");
        assertThat(PostCatalogFilter.of(null, null, null, null, "a").q()).isNull();
        assertThat(PostCatalogFilter.of(null, null, null, null, "   ").q()).isNull();
        assertThat(PostCatalogFilter.of(null, null, null, null, null).q()).isNull();
        assertThat(PostCatalogFilter.of(null, null, null, null, "x".repeat(150)).q()).hasSize(100);
    }

    @Test
    void of_parsesTimeLeniently() {
        assertThat(PostCatalogFilter.of(null, null, null, "short", null).time())
                .isEqualTo(ReadingTimeBucket.SHORT);
        assertThat(PostCatalogFilter.of(null, null, null, "bogus", null).time()).isNull();
    }

    @Test
    void of_passesIdentityFiltersThrough() {
        PostCatalogFilter f = PostCatalogFilter.of("ficcion", 3, 7, null, null);
        assertThat(f.categorySlug()).isEqualTo("ficcion");
        assertThat(f.categoryId()).isEqualTo(3);
        assertThat(f.authorId()).isEqualTo(7);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=PostCatalogFilterTest`
Expected: COMPILATION ERROR.

- [ ] **Step 3: Write `PostCatalogFilter`**

```java
package com.blog.blog_literario.dto.posts;

/**
 * All active catalog facets for one request, already normalized. Adding a facet means
 * adding a component here + its specification — the service signature never changes again.
 */
public record PostCatalogFilter(
        String categorySlug,
        Integer categoryId,
        Integer authorId,
        ReadingTimeBucket time,
        String q) {

    private static final int MAX_QUERY_LENGTH = 100;
    private static final int MIN_QUERY_LENGTH = 2;

    /** Builds a filter from raw request params: lenient time parsing, q trimmed/bounded. */
    public static PostCatalogFilter of(
            String category, Integer categoryId, Integer authorId, String time, String q) {
        return new PostCatalogFilter(
                blankToNull(category), categoryId, authorId,
                ReadingTimeBucket.from(time), normalizeQuery(q));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private static String normalizeQuery(String q) {
        if (q == null) {
            return null;
        }
        String trimmed = q.trim();
        if (trimmed.length() < MIN_QUERY_LENGTH) {
            return null;
        }
        return trimmed.length() > MAX_QUERY_LENGTH ? trimmed.substring(0, MAX_QUERY_LENGTH) : trimmed;
    }
}
```

- [ ] **Step 4: Run filter test to verify it passes**

Run: `.\mvnw.cmd test -Dtest=PostCatalogFilterTest`
Expected: PASS (3 tests).

- [ ] **Step 5: Extend the failing controller tests**

Replace the two `listPublishedPosts(...)` stubs' signatures throughout `PublicPostControllerTest` — the service method now takes `(PostCatalogFilter, PostCatalogSort, Pageable)`. Update all existing `given(...)`/`verify(...)` lines to the new arity, e.g. the categoryId test becomes:

```java
    @Test
    void list_withCategoryId_delegatesFilterToService() throws Exception {
        given(publicPostQueryService.listPublishedPosts(
                any(PostCatalogFilter.class), any(PostCatalogSort.class), any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/public/posts?categoryId=5"))
                .andExpect(status().isOk());

        ArgumentCaptor<PostCatalogFilter> filter = ArgumentCaptor.forClass(PostCatalogFilter.class);
        verify(publicPostQueryService).listPublishedPosts(
                filter.capture(), any(PostCatalogSort.class), any(Pageable.class));
        assertThat(filter.getValue().categoryId()).isEqualTo(5);
    }
```

and add these new tests (same imports style; add `import org.mockito.ArgumentCaptor;` and `import static org.assertj.core.api.Assertions.assertThat;`):

```java
    @Test
    void list_stackedFacets_allReachTheServiceTogether() throws Exception {
        given(publicPostQueryService.listPublishedPosts(
                any(PostCatalogFilter.class), any(PostCatalogSort.class), any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/public/posts?category=ficcion&time=short&authorId=7&q=borges&sort=recent"))
                .andExpect(status().isOk());

        ArgumentCaptor<PostCatalogFilter> filter = ArgumentCaptor.forClass(PostCatalogFilter.class);
        verify(publicPostQueryService).listPublishedPosts(
                filter.capture(), eq(PostCatalogSort.RECENT), any(Pageable.class));
        assertThat(filter.getValue().categorySlug()).isEqualTo("ficcion");
        assertThat(filter.getValue().time()).isEqualTo(com.blog.blog_literario.dto.posts.ReadingTimeBucket.SHORT);
        assertThat(filter.getValue().authorId()).isEqualTo(7);
        assertThat(filter.getValue().q()).isEqualTo("borges");
    }

    @Test
    void list_unknownTimeAndShortQ_areSilentlyIgnoredNot400() throws Exception {
        given(publicPostQueryService.listPublishedPosts(
                any(PostCatalogFilter.class), any(PostCatalogSort.class), any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/public/posts?time=bogus&q=a"))
                .andExpect(status().isOk());

        ArgumentCaptor<PostCatalogFilter> filter = ArgumentCaptor.forClass(PostCatalogFilter.class);
        verify(publicPostQueryService).listPublishedPosts(
                filter.capture(), any(PostCatalogSort.class), any(Pageable.class));
        assertThat(filter.getValue().time()).isNull();
        assertThat(filter.getValue().q()).isNull();
    }
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `.\mvnw.cmd test -Dtest=PublicPostControllerTest`
Expected: COMPILATION ERROR — service has no such method yet.

- [ ] **Step 7: Refactor service and controller**

`PublicPostQueryService` — replace the three `listPublishedPosts` overloads with:

```java
    /**
     * Returns a paginated page of published posts constrained by every active facet in
     * {@code filter}, ordered by {@code catalogSort}. Absent facets (nulls) don't
     * constrain the query — {@link Specification#allOf} skips null specifications.
     * Any sort carried by {@code pageable} is discarded; only whitelisted
     * {@link PostCatalogSort} orderings reach the query.
     */
    public Page<PublicPostResponse> listPublishedPosts(
            PostCatalogFilter filter, PostCatalogSort catalogSort, Pageable pageable) {
        Pageable effective = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), catalogSort.toSort());
        Specification<Post> spec = Specification.allOf(
                PostCatalogSpecifications.isPublished(),
                PostCatalogSpecifications.hasCategorySlug(filter.categorySlug()),
                PostCatalogSpecifications.hasCategory(filter.categoryId()),
                PostCatalogSpecifications.hasAuthor(filter.authorId()),
                PostCatalogSpecifications.readingTimeIn(filter.time()),
                PostCatalogSpecifications.matchesQuery(filter.q()));
        return postRepository.findAll(spec, effective).map(this::toResponse);
    }
```

New imports: `org.springframework.data.jpa.domain.Specification`, `com.blog.blog_literario.dto.posts.PostCatalogFilter`, `com.blog.blog_literario.repositories.PostCatalogSpecifications`. Delete the old `listPublishedPosts(Integer, PostCatalogSort, Pageable)`, `listPublishedPosts(Integer, Pageable)` and `listPublishedPosts(Pageable)` overloads; then run `grep -rn "listPublishedPosts" src/` and fix any remaining caller (only the controller and its test should reference it).

`PublicPostController.list` becomes:

```java
    /**
     * Returns a paginated feed of published posts filtered by any combination of
     * stacked facets: {@code category} (slug), {@code categoryId} (legacy), {@code authorId},
     * {@code time} (short|medium|long over the persisted word count), and {@code q}
     * (title + author name search). Unknown facet values are ignored, never an error —
     * these parameters live in shareable URLs.
     */
    @GetMapping
    public Page<PublicPostResponse> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sort,
            @PageableDefault(size = 10) Pageable pageable) {
        return publicPostQueryService.listPublishedPosts(
                PostCatalogFilter.of(category, categoryId, authorId, time, q),
                PostCatalogSort.from(sort), pageable);
    }
```

with import `com.blog.blog_literario.dto.posts.PostCatalogFilter`.

- [ ] **Step 8: Run the full backend suite**

Run: `.\mvnw.cmd test`
Expected: PASS. If `RateLimitFilterTest` or `JwtAuthenticationFilterTest` reference the old service signature, update their stubs to the new arity the same way.

- [ ] **Step 9: Commit**

```bash
git add -A src/
git commit -m "feat: stacked facet filtering on GET /api/public/posts via PostCatalogFilter"
```

---

### Task 9: Public authors list endpoint

**Files:**
- Create: `marginalia-api/src/main/java/com/blog/blog_literario/dto/users/PublicAuthorSummaryResponse.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/repositories/PostRepository.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/services/users/PublicAuthorService.java`
- Modify: `marginalia-api/src/main/java/com/blog/blog_literario/controllers/users/PublicAuthorController.java`
- Test: `marginalia-api/src/test/java/com/blog/blog_literario/controllers/users/PublicAuthorControllerAuthorsListTest.java`

**Interfaces:**
- Produces: `GET /api/public/authors` → `[{id, name}]` (authors with ≥1 PUBLISHED post, by name ascending). Consumed by Task 10's frontend service.

- [ ] **Step 1: Write the failing controller test**

Copy the `@WebMvcTest` scaffolding style from `PublicPostControllerTest` (same `@Import` list, same mock beans pattern):

```java
package com.blog.blog_literario.controllers.users;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import com.blog.blog_literario.config.SecurityConfig;
import com.blog.blog_literario.dto.users.PublicAuthorSummaryResponse;
import com.blog.blog_literario.security.CorrelationIdFilter;
import com.blog.blog_literario.security.JwtAuthenticationFilter;
import com.blog.blog_literario.security.JwtService;
import com.blog.blog_literario.security.RateLimitFilter;
import com.blog.blog_literario.security.UserDetailsServiceImpl;
import com.blog.blog_literario.services.users.PublicAuthorService;
import com.blog.blog_literario.support.WebMvcTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PublicAuthorController.class)
@Import({SecurityConfig.class, CorrelationIdFilter.class, JwtAuthenticationFilter.class, RateLimitFilter.class, WebMvcTestConfig.class})
@ActiveProfiles("test")
class PublicAuthorControllerAuthorsListTest {

    @Autowired MockMvc mockMvc;

    @MockBean PublicAuthorService publicAuthorService;
    @MockBean JwtService jwtService;
    @MockBean UserDetailsServiceImpl userDetailsService;

    @Test
    void listAuthors_noAuth_returnsIdAndNameOnly() throws Exception {
        given(publicAuthorService.listPublishedAuthors()).willReturn(List.of(
                new PublicAuthorSummaryResponse(1, "Alice Munro"),
                new PublicAuthorSummaryResponse(2, "Bruno Schulz")));

        mockMvc.perform(get("/api/public/authors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Alice Munro"))
                .andExpect(jsonPath("$[1].name").value("Bruno Schulz"));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `.\mvnw.cmd test -Dtest=PublicAuthorControllerAuthorsListTest`
Expected: COMPILATION ERROR.

- [ ] **Step 3: Implement DTO, repository query, service, controller**

`PublicAuthorSummaryResponse.java`:

```java
package com.blog.blog_literario.dto.users;

/** Minimal author identity for the catalog's author facet — nothing more than the dropdown needs. */
public record PublicAuthorSummaryResponse(Integer id, String name) {
}
```

`PostRepository.java` — add (import `com.blog.blog_literario.model.User`):

```java
    /** Authors that currently have at least one published post, for the public author facet. */
    @Query("SELECT DISTINCT p.author FROM Post p WHERE p.status = com.blog.blog_literario.model.PostStatus.PUBLISHED ORDER BY p.author.name ASC")
    List<User> findDistinctPublishedAuthors();
```

`PublicAuthorService.java` — add:

```java
    /** Authors with at least one published post, ordered by name; feeds the catalog's author facet. */
    public List<PublicAuthorSummaryResponse> listPublishedAuthors() {
        return postRepository.findDistinctPublishedAuthors().stream()
                .map(author -> new PublicAuthorSummaryResponse(author.getId(), author.getName()))
                .toList();
    }
```

(imports: `java.util.List`, `com.blog.blog_literario.dto.users.PublicAuthorSummaryResponse`)

`PublicAuthorController.java` — add:

```java
    /**
     * GET /api/public/authors
     * Authors with at least one published post (id + name), ordered by name.
     * Populates the catalog's author facet.
     */
    @GetMapping
    public List<PublicAuthorSummaryResponse> listAuthors() {
        return publicAuthorService.listPublishedAuthors();
    }
```

(imports: `java.util.List`, `com.blog.blog_literario.dto.users.PublicAuthorSummaryResponse`)

- [ ] **Step 4: Run test to verify it passes, then the full suite**

Run: `.\mvnw.cmd test -Dtest=PublicAuthorControllerAuthorsListTest` → PASS.
Run: `.\mvnw.cmd test` → PASS.

- [ ] **Step 5: Verify the endpoint is publicly reachable**

Check `SecurityConfig.java`: confirm `/api/public/**` is permitted anonymously (it already serves `/api/public/authors/{id}`). If the matcher is narrower, extend it to cover `/api/public/authors`.

- [ ] **Step 6: Commit**

```bash
git add -A src/
git commit -m "feat: add GET /api/public/authors for the catalog author facet"
```

---

### Task 10: Frontend authors service + hook (marginalia-web from here on)

**Files:**
- Modify: `marginalia-web/src/features/authors/services/publicAuthorService.js`
- Modify: `marginalia-web/src/features/authors/services/publicAuthorService.test.js`
- Create: `marginalia-web/src/features/authors/hooks/usePublicAuthors.js`

**Interfaces:**
- Consumes: `GET /public/authors` (Task 9), `apiClient` (existing).
- Produces: `publicAuthorService.getAllAuthors()`; `usePublicAuthors()` → `{ authors, loading, error }`. Used by the registry (Task 11).

- [ ] **Step 1: Write the failing service test**

Add to `publicAuthorService.test.js`:

```js
  it("getAllAuthors fetches the public author facet list", async () => {
    await publicAuthorService.getAllAuthors()

    expect(apiClient.get).toHaveBeenCalledWith("/public/authors")
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- publicAuthorService`
Expected: FAIL — `getAllAuthors is not a function`.

- [ ] **Step 3: Implement service + hook**

`publicAuthorService.js` — add to the object:

```js
  getAllAuthors: () => apiClient.get("/public/authors"),
```

`usePublicAuthors.js` (same shape as `usePublicCategories.js`):

```js
import { useCallback, useEffect, useState } from "react";
import { publicAuthorService } from "@/features/authors/services/publicAuthorService";
import { getErrorMessage } from "@/lib/apiError";

export function usePublicAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicAuthorService.getAllAuthors();
      setAuthors(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar los autores."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  return { authors, loading, error, reload: loadAuthors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- publicAuthorService`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd C:/repos/BlogProyecto/marginalia-web
git add src/features/authors/
git commit -m "feat: public authors service + hook for the author facet"
```

---

### Task 11: Declarative facet registry `catalogFacets.js`

**Files:**
- Create: `marginalia-web/src/features/posts/catalog/catalogFacets.js`
- Test: `marginalia-web/src/features/posts/catalog/catalogFacets.test.js`

**Interfaces:**
- Consumes: `usePublicCategories`, `usePublicAuthors` (hooks referenced, not called here).
- Produces: `CATALOG_FACETS` array; each entry `{ key, param, type: "select"|"search", label, allLabel?, defaultValue, clearable, normalize?, useOptions, toApiParams }`. Option shape: `{ value: string, label: string }`. `toApiParams` is PURE (`value → object`). Used by Tasks 12, 14, 15, 17.

- [ ] **Step 1: Write the failing test (pure parts only — hooks are tested via components later)**

```js
import { describe, expect, it } from "vitest";
import { CATALOG_FACETS, SORT_LABELS, TIME_OPTIONS } from "./catalogFacets";

const facet = (key) => CATALOG_FACETS.find((f) => f.key === key);

describe("catalogFacets registry", () => {
  it("declares the facets in sentence order with search last", () => {
    expect(CATALOG_FACETS.map((f) => f.key)).toEqual([
      "category",
      "time",
      "author",
      "sort",
      "q",
    ]);
  });

  it("every facet satisfies the registry contract", () => {
    for (const f of CATALOG_FACETS) {
      expect(f.param, f.key).toBeTruthy();
      expect(typeof f.toApiParams, f.key).toBe("function");
      expect(typeof f.useOptions, f.key).toBe("function");
      expect(["select", "search"]).toContain(f.type);
      expect(f).toHaveProperty("defaultValue");
      expect(f).toHaveProperty("clearable");
    }
  });

  it("toApiParams passes values through purely and omits inactive facets", () => {
    expect(facet("category").toApiParams("ficcion")).toEqual({ category: "ficcion" });
    expect(facet("category").toApiParams(null)).toEqual({});
    expect(facet("time").toApiParams("short")).toEqual({ time: "short" });
    expect(facet("author").toApiParams("7")).toEqual({ authorId: "7" });
    expect(facet("q").toApiParams("  borges  ")).toEqual({ q: "borges" });
    expect(facet("q").toApiParams("a")).toEqual({}); // under min length
    expect(facet("sort").toApiParams("recent")).toEqual({ sort: "recent" });
    expect(facet("sort").toApiParams(null)).toEqual({ sort: "featured" });
  });

  it("sort facet normalizes legacy raw sort strings and rejects unknown values", () => {
    expect(facet("sort").normalize("createdAt,desc")).toBe("recent");
    expect(facet("sort").normalize("title_asc")).toBe("title_asc");
    expect(facet("sort").normalize("bogus")).toBeNull();
  });

  it("sort is not clearable; the rest are", () => {
    expect(facet("sort").clearable).toBe(false);
    for (const key of ["category", "time", "author", "q"]) {
      expect(facet(key).clearable, key).toBe(true);
    }
  });

  it("time options carry the editorial labels", () => {
    expect(TIME_OPTIONS).toEqual([
      { value: "short", label: "Un café" },
      { value: "medium", label: "Una pausa" },
      { value: "long", label: "Sobremesa" },
    ]);
    expect(Object.keys(SORT_LABELS)).toEqual([
      "featured",
      "recent",
      "oldest",
      "title_asc",
      "title_desc",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- catalogFacets`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the registry**

```js
import { usePublicAuthors } from "@/features/authors/hooks/usePublicAuthors";
import { usePublicCategories } from "@/features/categories/hooks/usePublicCategories";

// Sort labels/keys moved verbatim from PostCatalog.jsx — same keys the API whitelists.
export const SORT_LABELS = {
  featured: "Destacados",
  recent: "Mas recientes",
  oldest: "Mas antiguas",
  title_asc: "Titulo A-Z",
  title_desc: "Titulo Z-A",
};

// Raw Spring Data sort strings we used to write to the URL; old bookmarks still carry them.
const LEGACY_SORTS = {
  "createdAt,desc": "recent",
  "createdAt,asc": "oldest",
  "title,asc": "title_asc",
  "title,desc": "title_desc",
};

export const TIME_OPTIONS = [
  { value: "short", label: "Un café" },
  { value: "medium", label: "Una pausa" },
  { value: "long", label: "Sobremesa" },
];

const SORT_OPTIONS = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }));

// Each facet owns its option source as a hook reference, consumed ONLY inside the
// generic FacetControl (one component instance per facet, so hook rules hold).
const useCategoryOptions = () => {
  const { categories } = usePublicCategories();
  return categories.map((c) => ({ value: c.slug, label: c.name }));
};

const useAuthorOptions = () => {
  const { authors } = usePublicAuthors();
  return authors.map((a) => ({ value: String(a.id), label: a.name }));
};

const useTimeOptions = () => TIME_OPTIONS;
const useSortOptions = () => SORT_OPTIONS;
const useNoOptions = () => null;

/**
 * The catalog's facet registry — THE single place a facet is defined.
 *
 * Contract (see spec, "extensibility acid test"): adding a facet is ONE new entry here,
 * bringing its own useOptions hook and a PURE toApiParams (value → params object, no
 * context). useCatalogFilters, CatalogFilterBar, FacetControl, useCatalogPosts and
 * publicPostService iterate this array generically and must never need edits for a new
 * facet. Registry order = sentence order in the UI.
 */
export const CATALOG_FACETS = [
  {
    key: "category",
    param: "category",
    type: "select",
    label: "Categoría",
    allLabel: "todas",
    defaultValue: null,
    clearable: true,
    useOptions: useCategoryOptions,
    toApiParams: (value) => (value ? { category: value } : {}),
  },
  {
    key: "time",
    param: "time",
    type: "select",
    label: "Tiempo",
    allLabel: "cualquiera",
    defaultValue: null,
    clearable: true,
    normalize: (raw) => (TIME_OPTIONS.some((o) => o.value === raw) ? raw : null),
    useOptions: useTimeOptions,
    toApiParams: (value) => (value ? { time: value } : {}),
  },
  {
    key: "author",
    param: "author",
    type: "select",
    label: "Autor",
    allLabel: "todos",
    defaultValue: null,
    clearable: true,
    useOptions: useAuthorOptions,
    toApiParams: (value) => (value ? { authorId: value } : {}),
  },
  {
    key: "sort",
    param: "sort",
    type: "select",
    label: "Orden",
    defaultValue: "featured",
    clearable: false, // "Limpiar filtros" resets filters, not the ordering
    normalize: (raw) => (SORT_LABELS[raw] ? raw : LEGACY_SORTS[raw] ?? null),
    useOptions: useSortOptions,
    toApiParams: (value) => ({ sort: value ?? "featured" }),
  },
  {
    key: "q",
    param: "q",
    type: "search",
    label: "Buscar",
    defaultValue: "",
    clearable: true,
    useOptions: useNoOptions,
    toApiParams: (value) => {
      const trimmed = (value ?? "").trim();
      return trimmed.length >= 2 ? { q: trimmed } : {};
    },
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- catalogFacets`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/posts/catalog/
git commit -m "feat: declarative catalog facet registry"
```

---

### Task 12: Generic `useCatalogFilters` hook

**Files:**
- Create: `marginalia-web/src/features/posts/catalog/useCatalogFilters.js`
- Test: `marginalia-web/src/features/posts/catalog/useCatalogFilters.test.jsx`

**Interfaces:**
- Consumes: `CATALOG_FACETS` (Task 11), `useSearchParams` (react-router-dom).
- Produces: `useCatalogFilters({ locked = {}, facets = CATALOG_FACETS })` → `{ values, setFacet(key, value, { replace }), clearAll(), anyActive, apiParams }`. The `facets` parameter exists so tests (and the acid test, Task 17) can inject a registry; production callers never pass it. Used by Tasks 14, 15, 17.

- [ ] **Step 1: Write the failing test**

```jsx
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useCatalogFilters } from "./useCatalogFilters";

// Wrapper factory: initial URL + a probe to read the resulting search params.
const makeWrapper = (initialSearch = "") =>
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[`/catalog${initialSearch}`]}>{children}</MemoryRouter>
    );
  };

const useHarness = (options) => {
  const filters = useCatalogFilters(options);
  const [searchParams] = useSearchParams();
  return { filters, search: searchParams.toString() };
};

describe("useCatalogFilters", () => {
  it("reads facet values from the URL, applying defaults and normalization", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&sort=createdAt,desc"),
    });

    expect(result.current.filters.values.category).toBe("ficcion");
    expect(result.current.filters.values.time).toBe("short");
    expect(result.current.filters.values.sort).toBe("recent"); // legacy alias normalized
    expect(result.current.filters.values.author).toBeNull();
    expect(result.current.filters.values.q).toBe("");
  });

  it("unknown facet values fall back to defaults instead of breaking", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?time=bogus&sort=bogus"),
    });

    expect(result.current.filters.values.time).toBeNull();
    expect(result.current.filters.values.sort).toBe("featured");
  });

  it("setFacet writes to the URL and omits default values", () => {
    const { result } = renderHook(() => useHarness(), { wrapper: makeWrapper() });

    act(() => result.current.filters.setFacet("time", "long"));
    expect(result.current.search).toBe("time=long");

    act(() => result.current.filters.setFacet("time", null));
    expect(result.current.search).toBe("");
  });

  it("clearAll removes clearable facets but preserves sort", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&q=borges&sort=recent"),
    });

    expect(result.current.filters.anyActive).toBe(true);
    act(() => result.current.filters.clearAll());

    expect(result.current.search).toBe("sort=recent");
    expect(result.current.filters.anyActive).toBe(false);
  });

  it("locked facets have fixed values, are excluded from the URL and from clearAll", () => {
    const { result } = renderHook(
      () => useHarness({ locked: { category: "poesia" } }),
      { wrapper: makeWrapper("?category=ficcion&time=short") },
    );

    // locked value wins over whatever the URL says
    expect(result.current.filters.values.category).toBe("poesia");

    // setting a locked facet is a no-op
    act(() => result.current.filters.setFacet("category", "ficcion"));
    expect(result.current.filters.values.category).toBe("poesia");

    // clearAll keeps the locked value active
    act(() => result.current.filters.clearAll());
    expect(result.current.filters.values.category).toBe("poesia");
    expect(result.current.filters.apiParams.category).toBe("poesia");
  });

  it("apiParams merges every facet's pure toApiParams", () => {
    const { result } = renderHook(() => useHarness(), {
      wrapper: makeWrapper("?category=ficcion&time=short&author=7&q=borges"),
    });

    expect(result.current.filters.apiParams).toEqual({
      category: "ficcion",
      time: "short",
      authorId: "7",
      sort: "featured",
      q: "borges",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useCatalogFilters`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the hook**

```js
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CATALOG_FACETS } from "./catalogFacets";

/**
 * Generic URL-synced state for the catalog facets. Iterates the registry — knows
 * nothing about any specific facet, so new facets need no changes here.
 *
 * `locked` pins facets to a fixed value (e.g. category on CategoryPage): a locked facet
 * ignores the URL, rejects setFacet, survives clearAll, and still contributes to
 * apiParams. Callers must pass a referentially stable object (useMemo it).
 * `facets` is injectable for tests only; production always uses CATALOG_FACETS.
 */
export function useCatalogFilters({ locked = {}, facets = CATALOG_FACETS } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = useMemo(() => {
    const result = {};
    for (const facet of facets) {
      if (facet.key in locked) {
        result[facet.key] = locked[facet.key];
        continue;
      }
      const raw = searchParams.get(facet.param);
      const normalized = raw != null && facet.normalize ? facet.normalize(raw) : raw;
      result[facet.key] = normalized ?? facet.defaultValue;
    }
    return result;
  }, [searchParams, locked, facets]);

  const setFacet = useCallback(
    (key, value, { replace = false } = {}) => {
      const facet = facets.find((f) => f.key === key);
      if (!facet || facet.key in locked) return;
      const next = new URLSearchParams(searchParams);
      if (value == null || value === "" || value === facet.defaultValue) {
        next.delete(facet.param);
      } else {
        next.set(facet.param, value);
      }
      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams, locked, facets],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    for (const facet of facets) {
      if (facet.clearable && !(facet.key in locked)) {
        next.delete(facet.param);
      }
    }
    setSearchParams(next);
  }, [searchParams, setSearchParams, locked, facets]);

  const anyActive = useMemo(
    () =>
      facets.some(
        (facet) =>
          facet.clearable &&
          !(facet.key in locked) &&
          values[facet.key] !== facet.defaultValue,
      ),
    [values, locked, facets],
  );

  const apiParams = useMemo(() => {
    let params = {};
    for (const facet of facets) {
      params = { ...params, ...facet.toApiParams(values[facet.key]) };
    }
    return params;
  }, [values, facets]);

  return { values, setFacet, clearAll, anyActive, apiParams };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- useCatalogFilters`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/posts/catalog/useCatalogFilters.js src/features/posts/catalog/useCatalogFilters.test.jsx
git commit -m "feat: generic URL-synced useCatalogFilters over the facet registry"
```

---

### Task 13: Generic `getCatalog(params)` + `useCatalogPosts({ apiParams })`

**Files:**
- Modify: `marginalia-web/src/features/posts/services/publicPostService.js`
- Modify: `marginalia-web/src/features/posts/services/publicPostService.test.js`
- Modify: `marginalia-web/src/features/posts/hooks/useCatalogPosts.js`

**Interfaces:**
- Consumes: `apiParams` shape from Task 12 (`{ category?, time?, authorId?, sort, q? }`).
- Produces: `publicPostService.getCatalog({ page, size, ...filters })` appending any filter generically; `useCatalogPosts({ apiParams, size })` with the same return shape as today (`posts, loading, loadingMore, error, hasMore, totalElements, loadMore, reload`). Used by Task 15.

- [ ] **Step 1: Update the failing service tests**

Replace the two `getCatalog` tests in `publicPostService.test.js`:

```js
  it("getCatalog sends any filter params generically, skipping null/empty ones", async () => {
    await publicPostService.getCatalog({
      category: "ficcion",
      time: "short",
      authorId: "7",
      q: "borges",
      sort: "recent",
      categoryId: null,
      page: 1,
      size: 6,
    })

    expect(apiClient.get).toHaveBeenCalledWith(
      `${BASE}?category=ficcion&time=short&authorId=7&q=borges&sort=recent&page=1&size=6`,
    )
  })

  it("getCatalog defaults to page 0 size 12 with no filters", async () => {
    await publicPostService.getCatalog()

    expect(apiClient.get).toHaveBeenCalledWith(`${BASE}?page=0&size=12`)
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- publicPostService`
Expected: FAIL — current implementation always injects `sort=featured` and knows only `categoryId`.

- [ ] **Step 3: Rewrite `getCatalog`**

```js
  // Generic facet passthrough: whatever params the facet registry produces are appended
  // as-is (null/empty skipped). New facets need no changes here.
  getCatalog: ({ page = 0, size = 12, ...filters } = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value != null && value !== "") params.set(key, value);
    }
    params.set("page", page);
    params.set("size", size);
    return apiClient.get(`${BASE_ENDPOINT}?${params.toString()}`);
  },
```

- [ ] **Step 4: Update `useCatalogPosts` to take `apiParams`**

Full new body of `useCatalogPosts.js`:

```js
import { useCallback, useEffect, useState } from "react";
import { publicPostService } from "@/features/posts/services/publicPostService";
import { getErrorMessage } from "@/lib/apiError";

export function useCatalogPosts({ apiParams = {}, size = 12 } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(0);
      const data = await publicPostService.getCatalog({ ...apiParams, page: 0, size });
      setPosts(data.content ?? []);
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar las publicaciones."));
    } finally {
      setLoading(false);
    }
  }, [apiParams, size]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    if (nextPage >= totalPages) return;
    try {
      setLoadingMore(true);
      const data = await publicPostService.getCatalog({ ...apiParams, page: nextPage, size });
      setPosts((prev) => [...prev, ...(data.content ?? [])]);
      setPage(nextPage);
      setTotalElements(data.page?.totalElements ?? totalElements);
      setTotalPages(data.page?.totalPages ?? totalPages);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar mas publicaciones."));
    } finally {
      setLoadingMore(false);
    }
  }, [apiParams, size, page, totalPages, totalElements]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore: page + 1 < totalPages,
    totalElements,
    loadMore,
    reload: load,
  };
}
```

**Note:** `apiParams` identity matters — `useCatalogFilters` already memoizes it, so the fetch only re-fires when a facet actually changes. PostCatalog (Task 15) is the only caller and passes it straight through. PostCatalog compiles against the old signature until Task 15; that's fine — the suite stays green because nothing renders PostCatalog in tests yet.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS — service tests green; no existing test exercises `useCatalogPosts` directly.

- [ ] **Step 6: Commit**

```bash
git add src/features/posts/services/ src/features/posts/hooks/useCatalogPosts.js
git commit -m "feat: generic catalog params in publicPostService and useCatalogPosts"
```

---

### Task 14: `FacetControl` + `CatalogFilterBar` (sentence UI)

**Files:**
- Create: `marginalia-web/src/features/posts/catalog/FacetControl.jsx`
- Create: `marginalia-web/src/features/posts/catalog/CatalogFilterBar.jsx`
- Test: `marginalia-web/src/features/posts/catalog/CatalogFilterBar.test.jsx`

**Interfaces:**
- Consumes: `CATALOG_FACETS`, `useCatalogFilters` outputs (`values, setFacet, clearAll, anyActive`).
- Produces: `<CatalogFilterBar values setFacet clearAll anyActive locked facets />` — renders the editorial sentence. `<FacetControl facet value onSelect />` — one control per facet; calls `facet.useOptions()` internally.

- [ ] **Step 1: Write the failing component test**

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CatalogFilterBar from "./CatalogFilterBar";

vi.mock(import("@/features/categories/hooks/usePublicCategories"), () => ({
  usePublicCategories: () => ({
    categories: [{ id: 1, name: "Ficción", slug: "ficcion" }],
    loading: false,
    error: null,
  }),
}));

vi.mock(import("@/features/authors/hooks/usePublicAuthors"), () => ({
  usePublicAuthors: () => ({
    authors: [{ id: 7, name: "Alice Munro" }],
    loading: false,
    error: null,
  }),
}));

const baseValues = { category: null, time: null, author: null, sort: "featured", q: "" };

const renderBar = (props = {}) => {
  const setFacet = vi.fn();
  const clearAll = vi.fn();
  render(
    <CatalogFilterBar
      values={baseValues}
      setFacet={setFacet}
      clearAll={clearAll}
      anyActive={false}
      locked={{}}
      {...props}
    />,
  );
  return { setFacet, clearAll };
};

describe("CatalogFilterBar", () => {
  it("renders the sentence with 'all' labels when nothing is active", () => {
    renderBar();

    expect(screen.getByRole("button", { name: /categoría/i })).toHaveTextContent("todas");
    expect(screen.getByRole("button", { name: /tiempo/i })).toHaveTextContent("cualquiera");
    expect(screen.getByRole("button", { name: /autor/i })).toHaveTextContent("todos");
    expect(screen.getByRole("button", { name: /orden/i })).toHaveTextContent("Destacados");
    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument();
  });

  it("shows the active option label in the trigger, resolved from the facet's options", () => {
    renderBar({ values: { ...baseValues, category: "ficcion", time: "short", author: "7" } });

    expect(screen.getByRole("button", { name: /categoría/i })).toHaveTextContent("Ficción");
    expect(screen.getByRole("button", { name: /tiempo/i })).toHaveTextContent("Un café");
    expect(screen.getByRole("button", { name: /autor/i })).toHaveTextContent("Alice Munro");
  });

  it("selecting an option calls setFacet with the facet key and value", async () => {
    const user = userEvent.setup();
    const { setFacet } = renderBar();

    await user.click(screen.getByRole("button", { name: /tiempo/i }));
    await user.click(await screen.findByRole("menuitem", { name: "Un café" }));

    expect(setFacet).toHaveBeenCalledWith("time", "short");
  });

  it("hides locked facets from the sentence", () => {
    renderBar({ locked: { category: "ficcion" } });

    expect(screen.queryByRole("button", { name: /categoría/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tiempo/i })).toBeInTheDocument();
  });

  it("shows 'Limpiar filtros' only when a filter is active, and wires it to clearAll", async () => {
    const user = userEvent.setup();
    renderBar();
    expect(screen.queryByRole("button", { name: /limpiar filtros/i })).not.toBeInTheDocument();

    const { clearAll } = renderBar({ anyActive: true });
    await user.click(screen.getAllByRole("button", { name: /limpiar filtros/i })[0]);
    expect(clearAll).toHaveBeenCalled();
  });

  it("debounces search input before committing to setFacet with replace", async () => {
    const user = userEvent.setup();
    const { setFacet } = renderBar();

    await user.type(screen.getByLabelText(/buscar/i), "borges");
    expect(setFacet).not.toHaveBeenCalled(); // not yet — debounced

    await waitFor(
      () => expect(setFacet).toHaveBeenCalledWith("q", "borges", { replace: true }),
      { timeout: 1000 },
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CatalogFilterBar`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `FacetControl.jsx`**

Design requirements (from spec): real buttons, plain-text sentence look, dotted underline under the value, hover → rose, visible focus ring, ≥44px touch target via padding, aria-labels naming facet + current value.

```jsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Shared editorial affordance: quiet text that reveals it's interactive on hover/focus.
const valueClasses =
  "underline decoration-dotted decoration-stone-400 underline-offset-4 " +
  "transition group-hover:text-rose-800 group-hover:decoration-rose-800 group-hover:decoration-solid " +
  "dark:decoration-stone-500 dark:group-hover:text-rose-400 dark:group-hover:decoration-rose-400";

function SelectFacet({ facet, value, onSelect }) {
  const options = facet.useOptions() ?? [];
  const active = options.find((option) => option.value === value) ?? null;
  const display = active?.label ?? facet.allLabel ?? options[0]?.label ?? "";

  return (
    <DropdownMenu>
      {/* min-h keeps the touch target ≥44px even though the text is thin */}
      <DropdownMenuTrigger
        className="group inline-flex min-h-11 cursor-pointer items-center gap-1 px-1 py-2 text-sm text-stone-600 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-rose-700 dark:text-stone-400"
        aria-label={`Filtrar por ${facet.label.toLowerCase()}, actual: ${display}`}
      >
        <span>{facet.label}:</span>
        <span className={`font-medium text-stone-900 dark:text-stone-200 ${valueClasses}`}>
          {display}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {facet.allLabel ? (
          <DropdownMenuItem onSelect={() => onSelect(facet.defaultValue)}>
            {facet.label}: {facet.allLabel}
          </DropdownMenuItem>
        ) : null}
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => onSelect(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchFacet({ facet, value, onSelect }) {
  const [draft, setDraft] = useState(value ?? "");

  // URL is the source of truth: re-sync when it changes externally (back button, clear).
  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  // Debounce ~350ms before committing to the URL (replace: no history spam, and it
  // respects the API rate budget while typing).
  useEffect(() => {
    if ((draft ?? "") === (value ?? "")) return undefined;
    const timer = setTimeout(() => onSelect(draft, { replace: true }), 350);
    return () => clearTimeout(timer);
  }, [draft, value, onSelect]);

  const inputId = `facet-${facet.key}`;

  return (
    <label
      htmlFor={inputId}
      className="inline-flex min-h-11 cursor-text items-center gap-1.5 px-1 py-2 text-sm text-stone-600 dark:text-stone-400"
    >
      <Search size={14} aria-hidden="true" />
      <span>{facet.label}:</span>
      <input
        id={inputId}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="título o autor"
        className="w-36 border-b border-dotted border-stone-400 bg-transparent pb-0.5 font-medium text-stone-900 outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:border-solid focus:border-rose-700 sm:w-44 dark:border-stone-500 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:border-rose-400"
      />
    </label>
  );
}

/** Renders one facet of the sentence; the facet's own useOptions hook runs here (one instance per facet). */
export default function FacetControl({ facet, value, onSelect }) {
  if (facet.type === "search") {
    return <SearchFacet facet={facet} value={value} onSelect={onSelect} />;
  }
  return <SelectFacet facet={facet} value={value} onSelect={onSelect} />;
}
```

- [ ] **Step 4: Write `CatalogFilterBar.jsx`**

```jsx
import { X } from "lucide-react";
import { CATALOG_FACETS } from "./catalogFacets";
import FacetControl from "./FacetControl";

/**
 * The catalog's filter state rendered as an editorial sentence:
 * "Categoría: Ficción · Tiempo: un café · Autor: todos · Orden: recientes · Buscar: _".
 * Maps generically over the facet registry — new facets appear here with zero edits.
 */
export default function CatalogFilterBar({
  values,
  setFacet,
  clearAll,
  anyActive,
  locked = {},
  facets = CATALOG_FACETS,
}) {
  const visibleFacets = facets.filter((facet) => !(facet.key in locked));

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
      {visibleFacets.map((facet, index) => (
        <span key={facet.key} className="inline-flex items-center">
          {index > 0 ? (
            <span className="mx-1.5 text-stone-300 dark:text-stone-600" aria-hidden="true">
              ·
            </span>
          ) : null}
          <FacetControl
            facet={facet}
            value={values[facet.key]}
            onSelect={(...args) => setFacet(facet.key, ...args)}
          />
        </span>
      ))}

      {anyActive ? (
        <button
          type="button"
          onClick={clearAll}
          className="ml-3 inline-flex min-h-11 cursor-pointer items-center gap-1 px-1 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 transition hover:text-rose-700 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:outline-none dark:text-stone-500 dark:hover:text-rose-400"
        >
          <X size={12} aria-hidden="true" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- CatalogFilterBar`
Expected: PASS (6 tests). If the Radix menu doesn't open under jsdom, check `src/test/setup.js` for the PointerEvent polyfill other Radix tests rely on; add the standard `window.HTMLElement.prototype.scrollIntoView ||= () => {}` + PointerEvent stubs there rather than weakening the test.

- [ ] **Step 6: Commit**

```bash
git add src/features/posts/catalog/FacetControl.jsx src/features/posts/catalog/CatalogFilterBar.jsx src/features/posts/catalog/CatalogFilterBar.test.jsx
git commit -m "feat: editorial sentence-style facet controls"
```

---

### Task 15: Rewire `PostCatalog` + empty state + `CategoryPage`

**Files:**
- Modify: `marginalia-web/src/features/posts/components/PostCatalog.jsx` (full rewrite)
- Test: `marginalia-web/src/features/posts/components/PostCatalog.test.jsx`

**Interfaces:**
- Consumes: `useCatalogFilters` (Task 12), `useCatalogPosts` (Task 13), `CatalogFilterBar` (Task 14), `CATALOG_FACETS` (Task 11).
- Produces: same public component API as before — `<PostCatalog lockedCategorySlug={slug} />`. `CategoryPage.jsx` needs **no changes** (it already passes `lockedCategorySlug`).

- [ ] **Step 1: Write the failing integration test**

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { publicPostService } from "@/features/posts/services/publicPostService";
import PostCatalog from "./PostCatalog";

vi.mock(import("@/features/posts/services/publicPostService"), () => ({
  publicPostService: { getCatalog: vi.fn() },
}));

vi.mock(import("@/features/categories/hooks/usePublicCategories"), () => ({
  usePublicCategories: () => ({
    categories: [{ id: 1, name: "Ficción", slug: "ficcion" }],
    loading: false,
    error: null,
  }),
}));

vi.mock(import("@/features/authors/hooks/usePublicAuthors"), () => ({
  usePublicAuthors: () => ({
    authors: [{ id: 7, name: "Alice Munro" }],
    loading: false,
    error: null,
  }),
}));

const PAGE = (posts) => ({
  content: posts,
  page: { totalElements: posts.length, totalPages: 1 },
});

const POST = { slug: "el-otono", title: "El otoño", categoryName: "Ficción", authorName: "Alice Munro" };

const renderCatalog = (initialSearch = "", props = {}) =>
  render(
    <MemoryRouter initialEntries={[`/catalog${initialSearch}`]}>
      <PostCatalog {...props} />
    </MemoryRouter>,
  );

describe("PostCatalog", () => {
  beforeEach(() => {
    publicPostService.getCatalog.mockReset();
    publicPostService.getCatalog.mockResolvedValue(PAGE([POST]));
  });

  it("passes stacked URL facets to the service as combined params", async () => {
    renderCatalog("?category=ficcion&time=short&author=7&q=borges&sort=recent");

    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith({
        category: "ficcion",
        time: "short",
        authorId: "7",
        q: "borges",
        sort: "recent",
        page: 0,
        size: 12,
      }),
    );
    expect(await screen.findByText("El otoño")).toBeInTheDocument();
  });

  it("locks the category facet when lockedCategorySlug is given", async () => {
    renderCatalog("", { lockedCategorySlug: "poesia" });

    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith(
        expect.objectContaining({ category: "poesia" }),
      ),
    );
    // the locked facet is not rendered as a control
    expect(screen.queryByRole("button", { name: /categoría/i })).not.toBeInTheDocument();
  });

  it("empty state with active filters offers per-facet removal and clear-all", async () => {
    publicPostService.getCatalog.mockResolvedValue(PAGE([]));
    const user = userEvent.setup();
    renderCatalog("?time=short&q=borges");

    expect(
      await screen.findByText(/no hay publicaciones con estos filtros/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quitar tiempo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quitar buscar/i })).toBeInTheDocument();

    // removing one facet refetches without it
    await user.click(screen.getByRole("button", { name: /quitar tiempo/i }));
    await waitFor(() =>
      expect(publicPostService.getCatalog).toHaveBeenCalledWith(
        expect.not.objectContaining({ time: "short" }),
      ),
    );
  });

  it("keeps the filter bar mounted while results reload", async () => {
    renderCatalog();
    await screen.findByText("El otoño");

    // trigger a reload by picking a facet; the search input must not unmount
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /tiempo/i }));
    await user.click(await screen.findByRole("menuitem", { name: "Un café" }));

    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- PostCatalog`
Expected: FAIL — current PostCatalog calls the old service shape and has no per-facet empty-state actions.

- [ ] **Step 3: Rewrite `PostCatalog.jsx`**

Key structural change vs. today: the filter bar renders ALWAYS (loading no longer unmounts it — otherwise typing in search would lose focus on every debounce commit); only the results grid swaps between skeleton/error/empty/posts.

```jsx
import { useMemo } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import PostCard from "@/features/posts/components/PostCard";
import { CATALOG_FACETS } from "@/features/posts/catalog/catalogFacets";
import CatalogFilterBar from "@/features/posts/catalog/CatalogFilterBar";
import { useCatalogFilters } from "@/features/posts/catalog/useCatalogFilters";
import { useCatalogPosts } from "@/features/posts/hooks/useCatalogPosts";
import { PageError } from "@/shared/components/PageError";

function ResultsSkeleton() {
  return (
    <div className="mt-10 grid animate-pulse gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border-t border-stone-200 pt-5 dark:border-stone-700">
          <div className="aspect-[4/3] rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="mt-5 h-4 w-24 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="mt-3 h-6 rounded bg-stone-200 dark:bg-stone-700" />
          <div className="mt-2 h-16 rounded bg-stone-100 dark:bg-stone-800" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ activeFacets, onRemoveFacet, onClearAll }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <BookOpen size={40} strokeWidth={1.5} className="text-stone-300 dark:text-stone-600" aria-hidden="true" />
      <p className="mt-6 font-serif text-2xl text-stone-400 dark:text-stone-500">
        No hay publicaciones con estos filtros todavia
      </p>
      {activeFacets.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {activeFacets.map((facet) => (
            <button
              key={facet.key}
              type="button"
              onClick={() => onRemoveFacet(facet.key, facet.defaultValue)}
              className="cursor-pointer text-sm text-stone-500 underline decoration-dotted underline-offset-4 transition hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-400"
            >
              Quitar {facet.label.toLowerCase()}
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-sm font-semibold text-stone-600 underline underline-offset-4 transition hover:text-rose-700 dark:text-stone-300 dark:hover:text-rose-400"
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function PostCatalog({ lockedCategorySlug = null }) {
  const locked = useMemo(
    () => (lockedCategorySlug ? { category: lockedCategorySlug } : {}),
    [lockedCategorySlug],
  );

  const { values, setFacet, clearAll, anyActive, apiParams } = useCatalogFilters({ locked });
  const { posts, loading, loadingMore, error, hasMore, totalElements, loadMore, reload } =
    useCatalogPosts({ apiParams, size: 12 });

  const activeFacets = CATALOG_FACETS.filter(
    (facet) =>
      facet.clearable && !(facet.key in locked) && values[facet.key] !== facet.defaultValue,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {loading ? "…" : `${totalElements} ${totalElements === 1 ? "publicacion" : "publicaciones"}`}
        </p>

        <CatalogFilterBar
          values={values}
          setFacet={setFacet}
          clearAll={clearAll}
          anyActive={anyActive}
          locked={locked}
        />
      </div>

      {loading ? (
        <ResultsSkeleton />
      ) : error ? (
        <PageError
          tone="public"
          as="h2"
          icon={BookOpen}
          title="No pudimos cargar el catálogo"
          message={error}
          onRetry={reload}
          className="min-h-[40vh]"
        />
      ) : posts.length === 0 ? (
        <EmptyState activeFacets={activeFacets} onRemoveFacet={setFacet} onClearAll={clearAll} />
      ) : (
        <>
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-stone-300 px-5 text-sm font-semibold text-stone-900 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white disabled:opacity-60 dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-100 dark:hover:text-stone-950"
              >
                {loadingMore ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : null}
                Cargar mas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

Notes:
- The old `SORT_LABELS`, `LEGACY_SORTS`, `FilterTrigger`, `PostCatalogSkeleton`, `lockedSort` state and the two dropdowns are all deleted — their responsibilities now live in the registry, hook, and filter bar.
- `CategoryPage.jsx` keeps working unchanged: `lockedCategorySlug` now flows into `locked.category` and the slug is passed straight to the API (`category` param) — the old slug→id lookup and `lockedSort` local state are gone with the rewrite.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- PostCatalog CatalogFilterBar`
Expected: PASS.

- [ ] **Step 5: Update the CatalogPage subtitle**

In `marginalia-web/src/pages/CatalogPage.jsx` (line 18), the copy still says "Filtra por categoria y orden…". Replace with:

```jsx
            Combina categoría, tiempo de lectura, autor y búsqueda para encontrar tu proxima lectura.
```

- [ ] **Step 6: Run the full frontend suite + lint**

Run: `npm run test` → PASS. Run: `npm run lint` → clean (delete now-unused imports flagged by ESLint).

- [ ] **Step 7: Commit**

```bash
git add src/features/posts/components/PostCatalog.jsx src/features/posts/components/PostCatalog.test.jsx src/pages/CatalogPage.jsx
git commit -m "feat: PostCatalog on the stacked facet system with smart empty state"
```

---

### Task 16: `PostPage` consumes `readingMinutes` from the API

**Files:**
- Modify: `marginalia-web/src/pages/PostPage.jsx` (lines 25–28 and 162)

**Interfaces:**
- Consumes: `PublicPostResponse.readingMinutes` (Task 6).

- [ ] **Step 1: Replace the local calculation**

Delete the `readingTime` function (lines 25–28) and the now-unused `editorContentToText` import (keep `editorContentToHtml`). Change line 162 from:

```jsx
                  {readingTime(post.content)} min de lectura
```

to:

```jsx
                  {post.readingMinutes ?? 1} min de lectura
```

The `?? 1` guards the brief window where a cached/older API response lacks the field; the backend itself never sends null.

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: PASS, no unused-import warnings.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PostPage.jsx
git commit -m "feat: PostPage reads readingMinutes from the API instead of recalculating"
```

---

### Task 17: Extensibility acid test (synthetic facet)

**Files:**
- Create: `marginalia-web/src/features/posts/catalog/facetExtensibility.test.jsx`

**Interfaces:**
- Consumes: `CATALOG_FACETS`, `useCatalogFilters` (with injected registry), `CatalogFilterBar` (with `facets` prop).

This test IS the acceptance criterion from the spec: a brand-new facet defined as one registry entry must get URL sync, apiParams, clearAll, and sentence rendering with zero changes to generic code. If this test needs anything beyond the entry itself, the abstraction leaked — fix the abstraction, not the test.

- [ ] **Step 1: Write the test (it should pass immediately — that's the proof)**

```jsx
import { act, render, renderHook, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CATALOG_FACETS } from "./catalogFacets";
import CatalogFilterBar from "./CatalogFilterBar";
import { useCatalogFilters } from "./useCatalogFilters";

vi.mock(import("@/features/categories/hooks/usePublicCategories"), () => ({
  usePublicCategories: () => ({ categories: [], loading: false, error: null }),
}));

vi.mock(import("@/features/authors/hooks/usePublicAuthors"), () => ({
  usePublicAuthors: () => ({ authors: [], loading: false, error: null }),
}));

// A hypothetical future "tema" facet — ONE declarative entry, nothing else.
const topicFacet = {
  key: "topic",
  param: "topic",
  type: "select",
  label: "Tema",
  allLabel: "todos",
  defaultValue: null,
  clearable: true,
  useOptions: () => [{ value: "melancolia", label: "Melancolía" }],
  toApiParams: (value) => (value ? { topic: value } : {}),
};

const EXTENDED = [...CATALOG_FACETS, topicFacet];

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={["/catalog?topic=melancolia&time=short"]}>
    {children}
  </MemoryRouter>
);

describe("facet extensibility acid test", () => {
  it("a new registry entry gets URL parsing, apiParams, and clearAll for free", () => {
    const { result } = renderHook(() => useCatalogFilters({ facets: EXTENDED }), { wrapper });

    // URL parsing: generic
    expect(result.current.values.topic).toBe("melancolia");

    // apiParams: merged from the entry's pure toApiParams
    expect(result.current.apiParams).toMatchObject({ topic: "melancolia", time: "short" });

    // clearAll: generic (clearable flag)
    act(() => result.current.clearAll());
    expect(result.current.values.topic).toBeNull();
    expect(result.current.apiParams).not.toHaveProperty("topic");

    // setFacet: generic
    act(() => result.current.setFacet("topic", "melancolia"));
    expect(result.current.values.topic).toBe("melancolia");
  });

  it("the sentence renders the new facet with its own options, no component edits", () => {
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <CatalogFilterBar
          values={{ category: null, time: null, author: null, sort: "featured", q: "", topic: "melancolia" }}
          setFacet={() => {}}
          clearAll={() => {}}
          anyActive={true}
          locked={{}}
          facets={EXTENDED}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /tema/i })).toHaveTextContent("Melancolía");
  });
});
```

- [ ] **Step 2: Run test — it must pass with NO production-code changes**

Run: `npm run test -- facetExtensibility`
Expected: PASS on first run. If it fails, the generic layer has a facet-specific assumption baked in — fix the generic layer (hook/components), never special-case the test.

- [ ] **Step 3: Commit**

```bash
git add src/features/posts/catalog/facetExtensibility.test.jsx
git commit -m "test: extensibility acid test - a new facet is one registry entry"
```

---

### Task 18: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full suites in both repos**

```bash
cd C:/repos/BlogProyecto/marginalia-api
.\mvnw.cmd test
cd C:/repos/BlogProyecto/marginalia-web
npm run test
npm run lint
npm run build
```
Expected: all green.

- [ ] **Step 2: Live end-to-end via the verify skill**

Invoke the `marginalia-web:verify` skill (it knows how to boot API + web locally) and walk this checklist in the browser:

1. `/catalog` — sentence reads "Categoría: todas · Tiempo: cualquiera · Autor: todos · Orden: Destacados · Buscar: _"; no "Limpiar filtros".
2. Pick Categoría → Ficción, Tiempo → Un café, type "a"+2 chars in Buscar → URL becomes `?category=...&time=short&q=...`; results shrink at each step (facets stack); count updates; "Limpiar filtros" appears.
3. Copy the URL into a new tab → identical filtered state restores (shareability).
4. Browser back button steps filters backward; typing in search does NOT create history entries.
5. "Limpiar filtros" → filters gone, sort preserved, URL keeps only `sort`.
6. Force an empty combination → empty state offers "Quitar tiempo" etc. + "Limpiar filtros"; each works.
7. `/categoria/<slug>` — no category control in the sentence; time/author/search/sort work and URL-sync; posts stay within the category.
8. Open a post → "N min de lectura" renders from the API (network tab: `readingMinutes` in the JSON; verify the value matches ceil(words/200)).
9. Legacy URL `/catalog?sort=createdAt,desc` still loads sorted by recency.
10. Keyboard-only pass: Tab reaches every facet trigger (visible focus ring), Enter opens the menu, arrows+Enter select. Mobile viewport (~375px): sentence wraps, every target comfortably tappable (≥44px).

- [ ] **Step 3: Confirm backfill on a database with pre-existing posts**

Start the API against the dev database and check the log line `WordCountBackfill: computed word_count for N posts` on first boot, and `nothing to backfill` on second boot.

- [ ] **Step 4: Final commit if verification produced fixes**

```bash
git add -A && git commit -m "fix: adjustments from end-to-end verification"
```
(Skip if nothing changed.)
