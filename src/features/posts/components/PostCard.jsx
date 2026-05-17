import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { BASE_URL } from "@/lib/apiClient";

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (content, maxLength = 140) => {
  const text = stripHtml(content);
  if (!text) return "Una lectura nueva del archivo literario.";
  return text.length > maxLength
    ? `${text.slice(0, maxLength).trim()}...`
    : text;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export default function PostCard({ post, hideAuthor = false }) {
  const author = post.authorName ?? post.AuthorName ?? "Autor";
  const category = post.categoryName ?? post.CategoryName ?? "Lectura";
  const coverImage = post.coverImage;
  const imageSrc = coverImage ? `${BASE_URL}/images/${coverImage}` : null;

  return (
    // group permite que los hijos reaccionen al hover del article completo
    <article className="group h-full border-t border-stone-200 pt-5 transition-transform duration-200 ease-out hover:-translate-y-1">
      <Link to={`/post/${post.slug}`} className="grid h-full gap-4">

        {/* Imagen — escala suave + sombra al hacer hover */}
        <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100 shadow-sm transition-shadow duration-200 group-hover:shadow-md">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-300 transition-colors duration-200 group-hover:text-stone-400">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex h-full flex-col">
          {/* Categoría y fecha */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-rose-700">
            <span>{category}</span>
            <span className="text-stone-300">/</span>
            <time className="text-stone-500">{formatDate(post.createdAt)}</time>
          </div>

          {/* Título — cambia a rose en hover del article */}
          <h2 className="mt-3 font-serif text-2xl leading-tight text-stone-950 transition-colors duration-200 group-hover:text-rose-800">
            {post.title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            {getExcerpt(post.content)}
          </p>

          {!hideAuthor && (
            <p className="mt-5 text-sm font-medium text-stone-900">
              Por {author}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}