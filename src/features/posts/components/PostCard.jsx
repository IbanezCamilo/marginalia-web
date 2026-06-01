import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { editorContentToText } from "@/features/posts/utils/editorContent";

const getExcerpt = (content, maxLength = 140) => {
  const text = editorContentToText(content);
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

export default function PostCard({ post, hideAuthor = false, headingAs = "h2" }) {
  const Heading = headingAs;
  const author = post.authorName ?? post.AuthorName ?? "Autor";
  const category = post.categoryName ?? post.CategoryName ?? "Lectura";
  const imageSrc = post.coverImage;
  const isoDate = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;

  return (
    <article className="group h-full border-t border-stone-200 pt-5 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:transition-none dark:border-stone-700">
      <Link to={`/post/${post.slug}`} className="grid h-full gap-4">

        <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100 shadow-sm transition-shadow duration-200 group-hover:shadow-md dark:bg-stone-800">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-300 transition-colors duration-200 group-hover:text-stone-400 dark:text-stone-600 dark:group-hover:text-stone-500">
              <BookOpen size={32} strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-rose-700 dark:text-rose-500">
            <span>{category}</span>
            <span className="text-stone-300 dark:text-stone-600" aria-hidden="true">/</span>
            {isoDate ? (
              <time dateTime={isoDate} className="text-stone-500 dark:text-stone-400">
                {formatDate(post.createdAt)}
              </time>
            ) : null}
          </div>

          <Heading className="mt-3 font-serif text-2xl leading-tight text-stone-950 transition-colors duration-200 group-hover:text-rose-800 dark:text-stone-50 dark:group-hover:text-rose-400">
            {post.title}
          </Heading>

          <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
            {getExcerpt(post.content)}
          </p>

          {!hideAuthor && (
            <p className="mt-5 text-sm font-medium text-stone-900 dark:text-stone-300">
              Por {author}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
