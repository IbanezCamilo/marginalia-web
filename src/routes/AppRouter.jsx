import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "@/features/auth/pages/LoginPage.jsx";
import CreatePost from "../panelpages/createPost.jsx";
import EditPost from "../panelpages/EditPost.jsx";
import DashBoard from "../panelpages/Dashboard.jsx";
import AdminLayout from "../panel-components/layout/AdminLayout.jsx";
import PostPage from "../pages/PostPage.jsx";
import ProfilePage from "../panelpages/ProfilePage.jsx";
import Categories from "@/panelpages/Categories.jsx";
import Posts from "@/features/posts/pages/Posts.jsx";

export const router = createBrowserRouter([
  //Public home route
  { path: "/", element: <App /> },

  //Public routes
  {
    path: "/auth",
    children: [{ path: "login", element: <LoginPage /> }],
  },

  //Public post page
  {
    path: "/post/:id",
    element: <PostPage />,
  },

  //Private routes
  {
    path: "/user",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "edit-post/:id", element: <EditPost /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "categories", element: <Categories /> },
      { path: "posts", element: <Posts /> },
    ],
  },
]);
