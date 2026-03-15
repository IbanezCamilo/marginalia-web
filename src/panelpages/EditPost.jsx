import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostEditor from "../panel-components/posts/PostEditor";
import { MyPostService } from "../data/myPostService";
import { validatePost } from "@/utils/postValidation";
import { categoryService } from "../data/categoryService";
import EditorHeader from "@/panel-components/posts/EditorHeader";
import SideBarSettings from "@/panel-components/posts/SideBarSettings";

export default function EditPost() {
  const { id } = useParams(); // Extrae el :id de la URL → "/user/edit-post/42"
  const navigate = useNavigate();

  const [post, setPost] = useState(null); // null while loading
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, serLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // To detect changes and show "Unsaved changes" indicator in header
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        serLoadError(null);

        const [postData, categoriesData] = await Promise.all([
          MyPostService.getPostById(Number(id)),
          categoryService.getAllCategories(),
        ]);

        // Post mapping to match the expected structure in the editor
        const mappedPost = {
          title: postData.title,
          content: postData.content,
          categoryId: postData.categoryId,
          status: postData.status,
          image: postData.coverImage ?? "",
          previewUrl: postData.coverImage
            ? `http://localhost:8080/api/images/${postData.coverImage}`
            : "",
          updatedAt: postData.updatedAt,
          createdAt: postData.createdAt,
        };

        console.log("Fecha de actualizacion es: " + postData.updatedAt);

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
        serLoadError("Error al cargar el post: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (field, value) => {
    if (field === "image") {
      setImage(value);
      return;
    }
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnSubmit = async (e, statusToSave) => {
    e?.preventDefault?.();

    const validation = validatePost(post, statusToSave);

    if (!validation.isValid) {
      validation.errors.forEach((err) => console.error("  -", err));
      alert(
        "Por favor completa todos los campos:\n\n" +
          validation.errors.join("\n"),
      );
      return;
    }

    const postData = {
      title: post.title.trim(),
      content: post.content,
      categoryId: post.categoryId,
      status: statusToSave,
    };

    try {
      setSubmitting(true);
      setSubmitError(null);

      await MyPostService.updatePost(Number(id), postData, image);

      alert(
        `Post ${statusToSave === "PUBLISHED" ? "Publicado" : "Guardado como borrador"} exitosamente!`,
      );

      navigate("/user/posts"); // Volver a la lista tras guardar
    } catch (error) {
      setSubmitError(error.message);
      alert("Error al actualizar el post:\n\n" + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  // Detect changes for "Unsaved changes" indicator in header
  const hasChanges =
    originalPost !== null &&
    (post?.title !== originalPost.title ||
      post?.content !== originalPost.content ||
      post?.categoryId !== originalPost.categoryId ||
      image !== null);

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
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
      {/* Fixed Header */}

      <EditorHeader
        onSaveDraft={(e) => handleOnSubmit(e, "DRAFT")}
        onPublish={(e) => handleOnSubmit(e, "PUBLISHED")}
        submitting={submitting}
        hasChanges={hasChanges}
      />

      {/* Main Layout: Editor + SideBar */}
      <div className="flex flex-col md:flex-row pt-16 gap-8">
        {/* Main container */}
        <main className="flex-1 max-w-4xl mx-auto px-8 py-6 bg-white p-6 rounded-sm shadow-sm">
          <PostEditor key={id} post={post} onChange={handleChange} />

          {/* Error de submit */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm whitespace-pre-line">
                {submitError}
              </p>
            </div>
          )}
        </main>

        {/* Fixed Right Sidebar */}
        <aside className="md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 rounded-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
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
