import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/myPostService";
import { validatePost } from "@/utils/postValidation";
import { categoryService } from "@/features/categories/services/categoryService";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiError";

const INITIAL_POST = {
  title: "",
  content: "",
  categoryId: "",
  image: "",
  previewUrl: "",
  focalX: 0.5,
  focalY: 0.5,
};

export function useCreatePost() {
  const navigate = useNavigate();
  const [post, setPost] = useState(INITIAL_POST);
  const [image, setImage] = useState(null); // image to upload
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  //Categories load
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const categoriesData = await categoryService.getAll();

      const categoriesMapped = categoriesData.map((cat) => {
        return { id: cat.id, name: cat.name };
      });
      setCategories(categoriesMapped);
    } catch (err) {
      setLoadError(getErrorMessage(err, "No se pudieron cargar las categorías."));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === "image") {
      setImage(value);
      return;
    }
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  //Uploading Post
  const handleOnSubmit = async (e, initialStatus) => {
    //Prevent default form submit
    e?.preventDefault?.();

    //Form Validation
    const validation = validatePost(post, initialStatus);

    if (!validation.isValid) {
      toast.warning("Por favor completa todos los campos:", {
        description: validation.errors.map(e => `• ${e}`).join("\n"),
        classNames: {
          description: "whitespace-pre-line"
        }
      });
      return;
    }

    //Data Preparing
    const postData = {
      title: post.title.trim(),
      content: post.content,
      categoryId: post.categoryId ? Number(post.categoryId) : null,
      status: initialStatus,
      focalX: post.focalX,
      focalY: post.focalY,
    };

    //Sending to Service
    try {
      setSubmitting(true);
      setSubmitError(null);

      await postService.create(postData, image);

      toast.success(`Post ${
          initialStatus === "PUBLISHED" ? "Publicado" : "Guardado como borrador"
        } exitosamente!`,)

      //Form reset
      setPost(INITIAL_POST);
      setImage(null);

      // Redirect to posts page after a short delay
      setTimeout(() => {
        navigate("/user/posts");
      }, 800);
    } catch (error) {
      const msg = getErrorMessage(error, "No se pudo crear el post.");
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    post, categories, loading, loadError, submitting, submitError, loadCategories, handleChange, handleOnSubmit
  }
}