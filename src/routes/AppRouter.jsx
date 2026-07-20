import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "@/features/auth/pages/LoginPage.jsx";
import RegisterPage from "@/features/auth/pages/RegisterPage.jsx";
import CheckEmailPage from "@/features/auth/pages/CheckEmailPage.jsx";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage.jsx";
import CreatePost from "../features/posts/pages/CreatePost.jsx";
import EditPost from "../features/posts/pages/EditPost.jsx";
import DashBoard from "../features/dashboard/pages/Dashboard.jsx";
import AdminLayout from "../panel/layout/AdminLayout.jsx";
import Categories from "@/features/categories/pages/Categories.jsx";
import Posts from "@/features/posts/pages/Posts.jsx";
import ProfilePage from "../features/profile/pages/ProfilePage.jsx";
import AuthorRequestPage from "@/features/authorRequest/pages/AuthorRequestPage.jsx";
import AdminAuthorRequests from "@/features/admin/pages/AdminAuthorRequests.jsx";
import AdminUsers from "@/features/admin/pages/AdminUsers.jsx";
import PostModeration from "@/features/moderation/pages/PostModeration.jsx";
import SettingsPage from "@/features/settings/pages/SettingsPage.jsx";
import PostPage from "@/pages/PostPage.jsx";
import CategoryPage from "@/pages/CategoryPage.jsx";
import CatalogPage from "@/pages/CatalogPage.jsx";
import AboutPage from "@/pages/AboutPage.jsx";
import AuthorPage from "@/pages/AuthorPage.jsx";
import NotFoundPage from "@/shared/pages/NotFoundPage.jsx";
import ErrorPage from "@/shared/pages/ErrorPage.jsx";
import PrivateRoute from "@/features/auth/components/PrivateRoute.jsx";
import RoleRoute from "@/features/auth/components/RoleRoute.jsx";

export const router = createBrowserRouter([
  {
    // Pathless layout route: catches render-time crashes from any route below
    // without changing any existing path.
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <App /> },

      {
        path: "/auth",
        children: [
          { path: "login",       element: <LoginPage /> },
          { path: "register",    element: <RegisterPage /> },
          { path: "check-email", element: <CheckEmailPage /> },
        ],
      },

      {
        // Top-level: the backend builds the emailed link as {frontend.url}/verify-email?token=...
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },

      {
        path: "/post/:slug",
        element: <PostPage />,
      },

      {
        path: "/author/:authorId",
        element: <AuthorPage/>,
      },

      {
        path: "/categoria/:slug",
        element: <CategoryPage />,
      },

      {
        path: "/catalog",
        element: <CatalogPage />,
      },

      {
        path: "/about",
        element: <AboutPage />,
      },

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
              { path: "settings", element: <SettingsPage /> },
              { path: "author-request", element: <AuthorRequestPage /> },
              { path: "posts", element: <Posts /> },
              {
                element: <RoleRoute minRole="MODERATOR" />,
                children: [
                  { path: "moderacion", element: <PostModeration /> },
                ],
              },
              {
                element: <RoleRoute minRole="ADMIN" />,
                children: [
                  { path: "solicitudes", element: <AdminAuthorRequests /> },
                  { path: "categories", element: <Categories /> },
                  { path: "usuarios", element: <AdminUsers /> },
                ],
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
