import { useState, useEffect } from "react";
import PostEditor from "../panel-components/posts/PostEditor";
import { MyPostService } from "../data/myPostService";
import { validatePost } from "@/utils/postValidation";
import { categoryService } from "../data/categoryService";
import EditorHeader from "@/panel-components/posts/EditorHeader";
import SideBarSettings from "@/panel-components/posts/SideBarSettings";

const INITIAL_POST = {
  title: "",
  content: "",
  categoryId: "",
  image: "",
  previewUrl: "",
};

export default function CreatePost() {
  const [post, setPost] = useState(INITIAL_POST);
  const [image, setImage] = useState(null); // image to upload
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [error, setError] = useState(null);

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
        console.log(cat.id + " " + cat.name);
        return { id: cat.id, name: cat.name };
      });
      setCategories(categoriesMapped);
    } catch (err) {
      setCategoriesError("Error al cargar las categorías: " + err.message);
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
  const handleOnSubmit = async (e, initialStatus) => {
    //Prevent default form submit
    e?.preventDefault?.();

    //Form Validation
    const validation = validatePost(post, initialStatus);

    if (!validation.isValid) {
      validation.errors.forEach((err) => console.error("  -", err));

      console.log("Validation failed:", validation);
      alert(
        "Por favor completa todos los campos:\n\n" +
          validation.errors.join("\n"),
      );
      return;
    }

    //Data Preparing
    const postData = {
      title: post.title.trim(),
      content: post.content,
      categoryId: post.categoryId,
    };

    //Sending to Service
    try {
      setSubmitting(true);
      setSubmitError(null);

      const createdPost = await MyPostService.createPost(postData, image);

      alert(
        `Post ${
          initialStatus === "PUBLISHED" ? "Publicado" : "Guardado como borrador"
        } exitosamente!`,
      );

      //Form reset
      setPost(INITIAL_POST);

      setImage(null);
    } catch (error) {
      setSubmitError(error.message);
      alert("Error al crear el post:\n\n" + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-16 bg-white border-b border-gray-200" />
        <div className="flex pt-16">
          <div className="flex-1 max-w-4xl mx-auto px-8 py-8">
            <div className="h-96 bg-gray-200 rounded-lg mb-8" />
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
          <div className="w-80 border-l border-gray-200 bg-white p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
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
    <div className="min-h-screen bg-gray-50">
      {/**Fixed Header */}
      <EditorHeader
        onSaveDraft={(e) => handleOnSubmit(e, "DRAFT")}
        onPublish={(e) => handleOnSubmit(e, "PUBLISHED")}
        submitting={submitting}
        hasChanges={post.title || post.content}
      />
      {/**Main Layout: Editor + SideBar */}
      <div className="flex flex-col md:flex-row pt-16 gap-8">
        {/**"Main container */}
        <main className="flex-1 max-w-4x mx-auto px-8 py-6  bg-white p-6 rounded-sm shadow-sm">
          <PostEditor post={post} onChange={handleChange} />

          {/* Error message if exist */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm whitespace-pre-line">
                {submitError}
              </p>
            </div>
          )}
        </main>

        {/* Fixed Right Sidebar */}
        <aside
          className="
        md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 rounded-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
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
