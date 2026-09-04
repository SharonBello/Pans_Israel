import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import AppRoutes from './routes';
import type { AppRoute } from './routes';
import { SeoRoute } from './components/SEO/SeoRoute';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer';
import { AccessibilityBar } from './components/AccessibilityBar';
import LegalDisclaimer from './components/LegalDisclaimer/LegalDisclaimer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Styles
import './styles/main.scss';
import './App.scss';

// RTL cache for MUI components
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <CacheProvider value={cacheRtl}>
      <Router>
        <div dir="rtl" lang="he" className="app">
          <LegalDisclaimer />
          <Header onMenuToggle={() => setIsMenuOpen((prev) => !prev)} isMenuOpen={isMenuOpen} />
          <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <AccessibilityBar />

          <main style={{ flex: '1 0 auto' }} className="main-content">
            <ScrollToTop />
            <Routes>
              {AppRoutes.map((route: AppRoute) => {
                const element = route.seo ? (
                  <SeoRoute
                    title={route.seo.title}
                    description={route.seo.description}
                    path={route.seo.canonicalPath ?? route.path}
                    noIndex={route.seo.noIndex}
                  >
                    {route.component}
                  </SeoRoute>
                ) : (
                  route.component
                );

                return <Route key={route.path} path={route.path} element={element} />;
              })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CacheProvider>
  );
}

export default App;