import { useState, useEffect } from "react";
import { postService } from "../services/myPostService";
import { categoryService } from "@/features/categories/services/categoryService";
import { validatePost } from "@/utils/postValidation";
import { toast } from "sonner";

export function useEditPost(id, navigate) {
  const [post, setPost] = useState(null); // null while loading
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  // To detect changes and show "Unsaved changes" indicator in header
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const [postData, categoriesData] = await Promise.all([
          postService.getById(Number(id)),
          categoryService.getAll(),
        ]);

        // Post mapping to match the expected structure in the editor
        const mappedPost = {
          title: postData.title,
          content: postData.content,
          categoryId: postData.categoryId,
          status: postData.status,
          image: postData.coverImage ?? "",
          previewUrl: postData.coverImage ?? "",
          updatedAt: postData.updatedAt,
          createdAt: postData.createdAt,
          moderationNote: postData.moderationNote,
          rejectionCount: postData.rejectionCount,
          canBeResubmitted: postData.canBeResubmitted,
          isLastAttempt: postData.isLastAttempt,
        };

        // If has image and previewUrl is empty, set it to the image URL
        setPost(mappedPost);

        // on Load
        setOriginalPost({
          title: postData.title,
          content: postData.content,
          categoryId: postData.categoryId,
        });

        setCategories(
          categoriesData.map((cat) => ({ id: cat.id, name: cat.name })),
        );
      } catch (err) {
        setLoadError("Error al cargar el post: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleOnSubmit = async (e, statusToSave) => {
    e?.preventDefault?.();

    if (post.status === "ARCHIVED") {
      toast.error("Este post está archivado y no puede modificarse.");
      return;
    }

    const validation = validatePost(post, statusToSave);

    if (!validation.isValid) {
      toast.warning("Por favor completa todos los campos:", {
        description: validation.errors.map(e => `• ${e}`).join("\n"),
        classNames: {
          description: "whitespace-pre-line"
        }
      });

      return;
    }

    const postData = {
      title: post.title.trim(),
      content: post.content,
      categoryId: Number(post.categoryId),
      status: statusToSave,
    };

    try {
      setSubmitting(true);
      setSubmitError(null);

      await postService.update(Number(id), postData, image);

      if (imageDeleted) {
        await postService.deleteCoverImage(Number(id));
      }

        toast.success(`Post ${
        statusToSave === "PUBLISHED" ? "Publicado" : "Guardado como borrador"
        } exitosamente!`,)

      navigate("/user/posts"); // Volver a la lista tras guardar
    } catch (error) {
      setSubmitError(error.message);
      toast.error("Error al actualizar el post:", {
        description: error.message
      });
    } finally {
      setSubmitting(false);
    }
  }

  const handleChange = (field, value) => {
    if (field === "image") {
      setImage(value);
      if (value === null) {
        setPost((prev) => ({ ...prev, image: "" }));
        setImageDeleted(true);
      } else {
        setImageDeleted(false);
      }
      return;
    }
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  return {
    post,
    categories,
    image,
    loading,
    loadError,
    submitting,
    submitError,
    originalPost,
    handleChange,
    handleOnSubmit,
  }
}