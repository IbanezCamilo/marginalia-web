import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "@/features/auth/pages/LoginPage.jsx";
import CreatePost from "../features/posts/pages/CreatePost.jsx";
import EditPost from "../features/posts/pages/EditPost.jsx";
import DashBoard from "../features/dashboard/pages/Dashboard.jsx";
import AdminLayout from "../panel/layout/AdminLayout.jsx";
import PostPage from "../pages/PostPage.jsx";
import ProfilePage from "../features/profile/pages/ProfilePage.jsx";
import Categories from "@/features/categories/pages/Categories.jsx";
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
