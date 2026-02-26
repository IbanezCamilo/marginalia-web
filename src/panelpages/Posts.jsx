import PostListItemCard from "@/panel-components/posts/postsList/PostListItemCard.jsx";
import { useState, useEffect } from "react";
import { postService } from "@/data/postService";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await postService.getAllPosts();
      setPosts(data);
      setLoadingPosts(false);
    };

    loadPosts();
  }, []);

  if (loadingPosts) return <p>Cargando Posts</p>;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {posts.map((post) => {
        return (
          <PostListItemCard
            key={post.id}
            imageUrl={post.coverImage}
            title={post.title}
          />
        );
      })}
    </div>
  );
}
