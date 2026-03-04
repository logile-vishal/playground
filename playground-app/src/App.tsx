import { RouterProvider, createHashRouter } from "react-router-dom";
import AppShell from "@/layouts/app-shell/AppShell";
import PlaygroundCanvas from "./PlaygroundCanvas";

const router = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <PlaygroundCanvas />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
