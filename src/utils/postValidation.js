import { isEditorContentEmpty } from "@/features/posts/utils/editorContent";

export const validatePost = (post, initialStatus) => {
  const errors = [];
  const hasContent = !isEditorContentEmpty(post.content);

  if (initialStatus === "PUBLISHED") {
    if (!post.title?.trim()) {
      errors.push("El título es obligatorio para publicar");
    } else if (post.title.trim().length < 5) {
      errors.push("El título debe tener al menos 5 caracteres");
    }

    if (!hasContent) {
      errors.push("El contenido es obligatorio para publicar");
    }

    if (!post.categoryId) {
      errors.push("Debes seleccionar una categoría");
    }
  }

  if (initialStatus === "DRAFT") {
    if (!post.title?.trim() && !hasContent) {
      errors.push("Un borrador debe tener al menos título o contenido");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
