import PostEditor from "../components/editor/PostEditor";
import EditorTopbar from "@/features/posts/components/editor/EditorTopBar";
import SideBarSettings from "@/features/posts/components/editor/SideBarSettings";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../hooks/useCreatePost";
import { isEditorContentEmpty } from "@/features/posts/utils/editorContent";

export default function CreatePost() {
  const {
    post,
    categories,
    loading,
    loadError,
    submitting,
    submitError,
    loadCategories,
    handleChange,
    handleOnSubmit,
  } = useCreatePost();

  if (loading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-16 bg-card border-b border-border" />
        <div className="flex pt-16">
          <div className="flex-1 max-w-4xl mx-auto px-8 py-8">
            <div className="h-96 bg-muted rounded-lg mb-8" />
            <div className="h-12 bg-muted rounded mb-4" />
            <div className="h-64 bg-muted rounded" />
          </div>
          <div className="w-80 border-l border-border bg-card p-6 space-y-4">
            <div className="h-8 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error al cargar categorías
  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <p className="text-destructive">{loadError}</p>
          <Button onClick={loadCategories} variant="destructive" className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/**Fixed Header */}
      <EditorTopbar
        onSaveDraft={(e) => handleOnSubmit(e, "DRAFT")}
        onPublish={(e) => handleOnSubmit(e, "PUBLISHED")}
        submitting={submitting}
        hasChanges={Boolean(post.title) || !isEditorContentEmpty(post.content)}
      />
      {/**Main Layout: Editor + SideBar */}
      <div className="flex flex-col lg:flex-row pt-16 gap-8">
        {/**"Main container */}
        <main className="flex-1 max-w-4xl mx-auto px-8 py-6 bg-card p-6 rounded-sm shadow-sm">
          <PostEditor post={post} onChange={handleChange} />

          {/* Error message if exist */}
          {submitError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm whitespace-pre-line">
                {submitError}
              </p>
            </div>
          )}
        </main>

        {/* Fixed Right Sidebar */}
        <aside
          className="
        lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border rounded-sm lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <SideBarSettings
            categories={categories}
            post={post}
            onChange={handleChange}
          />
        </aside>
      </div>
    </div>
  );
}
