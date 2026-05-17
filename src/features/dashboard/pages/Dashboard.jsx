import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Folder,
  PenLine,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "../components/PanelCard";
import { PanelCardSkeleton } from "../components/PanelCardSkeleton";
import { userService } from "../../profile/services/userService";
import { postService } from "../../posts/services/myPostService";
import { categoryService } from "../../categories/services/categoryService";

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getStatusLabel = (status) => {
  if (status === "PUBLISHED") return "Publicado";
  if (status === "DRAFT") return "Borrador";
  return status ?? "Sin estado";
};

const getStatusClassName = (status) => {
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "DRAFT") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-stone-200 bg-stone-100 text-stone-600";
};

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [postsData, setPostsData] = useState({
    posts: [],
    totalElements: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profile, postsResponse, categoriesResponse] = await Promise.all([
        userService.getProfile(),
        postService.getAll(0, 5),
        categoryService.getAll(),
      ]);

      setUser(profile);
      setPostsData({
        posts: postsResponse.content ?? [],
        totalElements: postsResponse.totalElements ?? 0,
      });
      setCategories(categoriesResponse ?? []);
    } catch (err) {
      setError("Error al cargar la informacion: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const published = postsData.posts.filter(
      (post) => post.status === "PUBLISHED",
    ).length;
    const drafts = postsData.posts.filter((post) => post.status === "DRAFT")
      .length;

    return [
      {
        label: "Publicaciones",
        value: postsData.totalElements,
        helper: "Total en tu archivo",
        icon: FileText,
      },
      {
        label: "Publicadas",
        value: published,
        helper: "Visibles para lectores",
        icon: BookOpen,
      },
      {
        label: "Borradores",
        value: drafts,
        helper: "Pendientes de cierre",
        icon: PenLine,
      },
      {
        label: "Categorias",
        value: categories.length,
        helper: "Temas disponibles",
        icon: Folder,
      },
    ];
  }, [categories.length, postsData.posts, postsData.totalElements]);

  const maxBarValue = Math.max(...stats.map((item) => item.value), 1);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <PanelCardSkeleton key={item} type="stats" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <PanelCardSkeleton type="list" />
          <PanelCardSkeleton type="actions" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center text-center">
        <BookOpen size={42} strokeWidth={1.5} className="text-rose-700" />
        <h1 className="mt-5 font-serif text-4xl text-stone-950">
          No pudimos abrir el panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{error}</p>
        <Button onClick={loadDashboard} className="mt-6 bg-stone-950">
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-md border border-stone-200 bg-[#fbf8f3] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
              Mesa de trabajo
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
              Bienvenido, {user?.name ?? "autor"}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              Revisa el estado de tu archivo, continua textos pendientes y
              conserva el ritmo editorial desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-stone-950 hover:bg-rose-900">
              <Link to="/user/create-post">
                <PenLine size={16} />
                Nuevo post
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-stone-300 bg-transparent"
            >
              <Link to="/user/posts">
                Ver archivo
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <PanelCard key={item.label} className="min-h-36">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    {item.label}
                  </p>
                  <p className="mt-3 font-serif text-4xl text-stone-950">
                    {item.value}
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-md border border-stone-200 bg-stone-50 text-rose-800">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
              </div>
              <p className="mt-4 text-sm text-stone-500">{item.helper}</p>
            </PanelCard>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <PanelCard>
          <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                Archivo reciente
              </p>
              <h2 className="mt-2 font-serif text-3xl text-stone-950">
                Ultimas publicaciones
              </h2>
            </div>
            <Button asChild variant="ghost" className="text-stone-700">
              <Link to="/user/posts">
                Todas
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {postsData.posts.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <BookOpen size={38} strokeWidth={1.5} className="text-stone-400" />
              <h3 className="mt-4 font-serif text-3xl text-stone-950">
                Tu primera publicacion espera
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
                Crea un borrador para comenzar a construir el archivo editorial
                del blog.
              </p>
              <Button asChild className="mt-5 bg-stone-950 hover:bg-rose-900">
                <Link to="/user/create-post">Crear post</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {postsData.posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/user/edit-post/${post.id}`}
                  className="group grid gap-3 py-4 transition-colors hover:bg-stone-50 sm:grid-cols-[1fr_auto] sm:px-2"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      <span>{post.categoryName ?? "Sin categoria"}</span>
                      <span className="text-stone-300">/</span>
                      <time>{formatDate(post.createdAt)}</time>
                    </div>
                    <h3 className="mt-2 line-clamp-2 font-serif text-2xl leading-tight text-stone-950 transition-colors group-hover:text-rose-800">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                        post.status,
                      )}`}
                    >
                      {getStatusLabel(post.status)}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-rose-800"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </PanelCard>

        <div className="space-y-6">
          <PanelCard>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-rose-50 text-rose-800">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Accesos rapidos
                </p>
                <h2 className="font-serif text-2xl text-stone-950">
                  Siguiente accion
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Button asChild className="justify-between bg-stone-950">
                <Link to="/user/create-post">
                  Escribir nueva entrada
                  <PenLine size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link to="/user/categories">
                  Organizar categorias
                  <Folder size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link to="/user/profile">
                  Ajustar perfil publico
                  <UserLinkIcon />
                </Link>
              </Button>
            </div>
          </PanelCard>

          <PanelCard>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Pulso editorial
            </p>
            <h2 className="mt-2 font-serif text-2xl text-stone-950">
              Resumen visual
            </h2>
            <div className="mt-5 space-y-4">
              {stats.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-stone-600">{item.label}</span>
                    <span className="font-medium text-stone-950">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-rose-800"
                      style={{
                        width: `${Math.max(
                          8,
                          (item.value / maxBarValue) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}

function UserLinkIcon() {
  return <PenLine size={16} />;
}
