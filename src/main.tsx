import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import '@fontsource/roboto/latin-100.css'; // Thin
import '@fontsource/roboto/latin-300.css'; // Light
import '@fontsource/roboto/latin-400.css'; // Regular
import '@fontsource/roboto/latin-500.css'; // Medium
import '@fontsource/roboto/latin-700.css'; // Bold
import '@fontsource/roboto/latin-900.css'; // Black

import { ThemeProvider } from './theme-mui/ThemeProvider';
import { NotificationContextProvider } from '@/core/components/NotificationContextProvider';
import "./i18n";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <App/>
        </NotificationContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
