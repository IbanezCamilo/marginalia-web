import { useState, useEffect } from "react";
import { PiUploadSimpleFill } from "react-icons/pi";
import PostEditor from "../panel-components/posts/PostEditor";
import LateralPanel from "../panel-components/posts/LateralPanel";
import PostSettingsPanel from "../panel-components/posts/PostSettingsPanel";
import { postService } from "../data/postService";
import { categoryService } from "../data/categoryService";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    content: "",
    idCategory: "",
    image: "", //Server url (when exist)
    previewUrl: "", //temp dataUrl for preview
  });
  const [image, setImage] = useState(null); // image to upload
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  //Categories load
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);

      const categoriesData = await categoryService.getAllCategories();

      const categoriesMapped = categoriesData.map((cat) => {
        return { id: cat.id, name: cat.name };
      });
      setCategories(categoriesMapped);
    } catch (err) {
      setError("Error al cargar las categorías: " + err.message);
    } finally {
      setLoadingCategories(false);
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
  const handleOnSubmit = async (e, estado) => {
    //Prevent default form submit
    e?.preventDefault?.();

    //Form Validation
    const validation = validateForm();

    if (!validation.isValid) {
      validation.errors.forEach((err) => console.error("  -", err));

      alert(
        "Por favor completa todos los campos:\n\n" +
          validation.errors.join("\n")
      );
      return;
    }

    //Data Preparing
    const postData = {
      title: post.title.trim(),
      content: post.content,
      idCategory: post.idCategory,
      status: post.status, //Draft or Published
    };

    //Sending to Service
    try {
      setSubmitting(true);
      setSubmitError(false);

      const createdPost = await postService.createPost(postData, image);

      alert(
        `Post ${
          this.status === "PUBLICADO" ? "publicado" : "guardado como borrador"
        } exitosamente!`
      );

      setPost({
        title: "",
        content: "",
        idCategory: "",
        image: "",
        previewUrl: "",
      });

      setImage(null);
    } catch (error) {
      setSubmitError(error.message);
      alert("Error al crear el post:\n\n" + error.message);
    } finally {
      setSubmitting(false);
    }

    // if (file) {
    //   // if the image is up
    //   formData.append("image", file);
    // }
  };

  // Estado de carga de categorías
  if (loadingCategories) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Error al cargar categorías
  if (categoriesError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{categoriesError}</p>
          <button
            onClick={loadCategories}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 w-full max-w-6xl p-4 mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Columna izquierda: Editor */}
      <div>
        <PostEditor post={post} onChange={handleChange} />
        {/* Mensaje de error si existe */}
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm whitespace-pre-line">
              {submitError}
            </p>
          </div>
        )}
      </div>

      {/* Columna derecha: Panel lateral */}
      <LateralPanel>
        <PostSettingsPanel
          post={post}
          categories={categories}
          onChange={handleChange}
          onSubmit={handleOnSubmit}
          submitting={submitting}
        />
      </LateralPanel>
    </form>
  );
}
