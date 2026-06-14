import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "@/features/auth/pages/LoginPage.jsx";
import RegisterPage from "@/features/auth/pages/RegisterPage.jsx";
import CreatePost from "../features/posts/pages/CreatePost.jsx";
import EditPost from "../features/posts/pages/EditPost.jsx";
import DashBoard from "../features/dashboard/pages/Dashboard.jsx";
import AdminLayout from "../panel/layout/AdminLayout.jsx";
import Categories from "@/features/categories/pages/Categories.jsx";
import Posts from "@/features/posts/pages/Posts.jsx";
import ProfilePage from "../features/profile/pages/ProfilePage.jsx";
import AuthorRequestPage from "@/features/authorRequest/pages/AuthorRequestPage.jsx";
import AdminAuthorRequests from "@/features/admin/pages/AdminAuthorRequests.jsx";
import PostPage from "@/pages/PostPage.jsx";
import CategoryPage from "@/pages/CategoryPage.jsx";
import AuthorPage from "@/pages/AuthorPage.jsx";
import NotFoundPage from "@/shared/pages/NotFoundPage.jsx";
import PrivateRoute from "@/features/auth/components/PrivateRoute.jsx";

export const router = createBrowserRouter([
  //Public home route
  { path: "/", element: <App /> },

  //Auth routes
  {
    path: "/auth",
    children: [
      { path: "login",    element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  //Public post page
  {
    path: "/post/:slug",
    element: <PostPage />,
  },

  //Public author page
  {
    path: "/author/:authorId",
    element: <AuthorPage/>,
  },

  // Public category page
  {
    path: "/categoria/:slug",
    element: <CategoryPage />,
  },

  //Private routes
  {
    path: "/user",
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <DashBoard /> },
          { path: "create-post", element: <CreatePost /> },
          { path: "edit-post/:id", element: <EditPost /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "author-request", element: <AuthorRequestPage /> },
          { path: "solicitudes", element: <AdminAuthorRequests /> },
          { path: "categories", element: <Categories /> },
          { path: "posts", element: <Posts /> },
        ],
      },
    ],
  },

  // Catch-all 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
