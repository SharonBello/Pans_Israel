import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './Auth/AuthContext';
import App from './App';
import './config/i18n';
import './styles/main.scss';

const rootElement: HTMLElement | null = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        {/* <BrowserRouter> */}
        <App />
        {/* </BrowserRouter> */}
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);