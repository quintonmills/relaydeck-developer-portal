import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/docs" replace /> },
      {
        path: 'docs',
        lazy: async () => {
          const { DocsPage } = await import('./pages/DocsPage');
          return { Component: DocsPage };
        },
      },
      {
        path: 'sandbox',
        lazy: async () => {
          const { WebhookSimulator } = await import('./pages/WebhookSimulator');
          return { Component: WebhookSimulator };
        },
      },
      {
        path: 'logs',
        lazy: async () => {
          const { LogsPage } = await import('./pages/LogsPage');
          return { Component: LogsPage };
        },
      },
      {
        path: 'snippets',
        lazy: async () => {
          const { SnippetsPage } = await import('./pages/SnippetsPage');
          return { Component: SnippetsPage };
        },
      },
      { path: '*', element: <Navigate to="/docs" replace /> },
    ],
  },
]);
