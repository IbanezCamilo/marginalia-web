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

  // ── Estado idéntico a CreatePost ──────────────────────────────────
  const [post, setPost] = useState(null); // null mientras carga (diferencia vs CreatePost)
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ── Carga de datos ────────────────────────────────────────────────
  // Diferencia clave vs CreatePost: también cargamos el post existente.
  // Promise.all ejecuta ambas peticiones en paralelo (más rápido que en serie).
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true);
        setCategoriesError(null);

        const [postData, categoriesData] = await Promise.all([
          MyPostService.getPostById(Number(id)),
          categoryService.getAllCategories(),
        ]);

        // Pre-poblar con los datos del post existente
        setPost({
          title: postData.title,
          content: postData.content,
          categoryId: postData.categoryId,
          status: postData.status,
          image: postData.coverImage ?? "",
          previewUrl: postData.coverImage
            ? `http://localhost:8080/api/images/${postData.coverImage}`
            : "",
        });

        setCategories(
          categoriesData.map((cat) => ({ id: cat.id, name: cat.name })),
        );
      } catch (err) {
        setCategoriesError("Error al cargar el post: " + err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadData();
  }, [id]);

  // ── Handlers idénticos a CreatePost ──────────────────────────────
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

      // Diferencia vs CreatePost: llamamos updatePost en lugar de createPost
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

  // ── Estados de carga y error (mismos que CreatePost) ─────────────
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

  if (categoriesError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{categoriesError}</p>
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

  // ── JSX idéntico a CreatePost ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <EditorHeader
        onSaveDraft={(e) => handleOnSubmit(e, "DRAFT")}
        onPublish={(e) => handleOnSubmit(e, "PUBLISHED")}
        submitting={submitting}
        hasChanges={post?.title || post?.content}
      />

      {/* Main Layout: Editor + SideBar */}
      <div className="flex flex-col md:flex-row pt-16 gap-8">
        {/* Main container */}
        <main className="flex-1 max-w-4x mx-auto px-8 py-6 bg-white p-6 rounded-sm shadow-sm">
          {/*
            key={id} es CRÍTICO para TipTap.
            TipTap inicializa su contenido una sola vez al montarse.
            Sin key, React reutiliza la instancia existente y TipTap
            ignora el contenido cargado del servidor.
            Con key={id}, React destruye y re-monta el componente,
            forzando a TipTap a inicializar con los datos correctos.
          */}
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
