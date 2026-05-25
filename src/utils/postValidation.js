import { isEditorContentEmpty } from "@/features/posts/utils/editorContent";

export const validatePost = (post, initialStatus) => {
  const errors = [];
  const hasContent = !isEditorContentEmpty(post.content);

  if (initialStatus === "PUBLISHED") {
    if (!post.title?.trim()) {
      errors.push("El titulo es obligatorio para publicar");
    }

    if (!hasContent) {
      errors.push("El contenido es obligatorio para publicar");
    }

    if (!post.categoryId) {
      errors.push("Debes seleccionar una categoria");
    }
  }

  if (initialStatus === "DRAFT") {
    if (!post.title?.trim() && !hasContent) {
      errors.push("Un borrador debe tener al menos titulo o contenido");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
