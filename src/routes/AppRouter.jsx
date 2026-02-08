import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import CreatePost from "../panelpages/createPost.jsx";
import DashBoard from "../panelpages/DashBoard.jsx";
import AdminLayout from "../panel-components/layout/AdminLayout.jsx";
import PostPage from "../pages/PostPage.jsx";
import ProfilePage from "../panelpages/ProfilePage.jsx";
import Categories from "@/panelpages/Categories.jsx";
import Posts from "@/panelpages/Posts.jsx";

export const router = createBrowserRouter([
  //Pagina principal
  { path: "/", element: <App /> },

  //Rutas Públicas
  {
    path: "/auth",
    children: [{ path: "login", element: <LoginPage /> }],
  },

  //Pagina del post
  {
    path: "/post/:id",
    element: <PostPage />,
  },

  //Rutas Privadas
  {
    path: "/user",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "categories", element: <Categories /> },
      { path: "posts", element: <Posts /> },
    ],
  },
]);
