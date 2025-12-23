import { useState, useEffect } from "react";
import { PiUploadSimpleFill } from "react-icons/pi";
import PostEditor from "../panel-components/posts/PostEditor";
import LateralPanel from "../panel-components/posts/LateralPanel";
import PostSettingsPanel from "../panel-components/posts/PostSettingsPanel";
import { categoriesDemo } from "../data/categoriesDemo";

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

  useEffect(() => {
    // Datos simulados mientras no haya backend
    setCategories(categoriesDemo);
  }, []);
  /*
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);
*/
  const handleChange = (field, value) => {
    if (field == "image") {
      setImage(value);
      setPost((p) => ({ ...p, image: "", previewUrl: p.previewUrl }));
      return;
    }
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  //Uploading Post
  const handleOnSubmit = async (e, estado) => {
    e?.preventDefault?.();

    const postData = {
      title: post.title,
      content: post.content,
      idCategory: post.idCategory,
      estado,
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );
    if (file) {
      // if the image is up
      formData.append("image", file);
    }

    try {
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Post creado con exito");
      } else {
        console.log("Error al crear el post", await response.text());
      }
    } catch (error) {
      console.log("Error de red: " + e);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 w-full max-w-6xl p-4 mx-auto">
      <div>
        <PostEditor post={post} onChange={handleChange} />
      </div>
      <LateralPanel>
        <PostSettingsPanel
          post={post}
          categories={categories}
          onChange={handleChange}
        />
      </LateralPanel>
    </form>
  );
}
