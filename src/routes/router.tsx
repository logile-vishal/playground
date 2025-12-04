import { createHashRouter } from "react-router-dom";

// import { IconsDemo } from '@/dev-playground/Icons';

import AppShell from "@/layouts/app-shell/AppShell";
import NoPageFound from "@/layouts/NoPageFound";
import TemplateLibrary from "@/pages/template-library";
import CreateTemplate from "@/pages/create-template";
import { ComponentLibraryLandingPage } from "@/dev-playground/LandingPage";
import TestPage from "@/dev-playground/TestPage";
import { ProtectedRoute } from "@/layouts/protected-routes/ProtectedRoutes";
import LoginPage from "@/pages/login/LoginPage";

const getDevRoutes = () => {
  if (import.meta.env.DEV) {
    return {
      path: "/dev",
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <ComponentLibraryLandingPage />,
        },
        {
          path: "component-library/icons",
          element: <></>,
        },
        {
          path: "test-page",
          element: <TestPage />,
        },
      ],
    };
  }
  return {};
};

const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <NoPageFound />,
  },
  {
    path: "/templates",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TemplateLibrary /> },
      { path: "create", element: <CreateTemplate /> },
    ],
  },
  {
    path: "*",
    element: <NoPageFound />,
  },
  getDevRoutes(),
]);

export default router;
