import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bulma';
import { AppRoute } from './routes';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './services/queryClient';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AppRoute />
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
