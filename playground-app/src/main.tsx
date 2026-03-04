import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "@fontsource/roboto/latin-100.css";
import "@fontsource/roboto/latin-300.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "@fontsource/roboto/latin-900.css";

import { ThemeProvider } from "@/theme-mui/ThemeProvider";
import { NotificationContextProvider } from "@/core/providers/NotificationContextProvider";
import { DirtyFormProvider } from "@/core/providers/DirtyFormContextProvider";
import { PlaygroundAuthProvider } from "./PlaygroundAuthProvider";
import "@/styles/main.scss";
import "@/i18n";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <PlaygroundAuthProvider>
            <DirtyFormProvider>
              <App />
            </DirtyFormProvider>
          </PlaygroundAuthProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
