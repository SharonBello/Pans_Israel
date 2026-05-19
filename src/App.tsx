import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes';
import type { AppRoute } from './routes';
import { SeoRoute } from './components/SEO/SeoRoute';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar/Sidebar';

// Styles
import './styles/main.scss';
import './App.scss';
import { AccessibilityBar } from './components/AccessibilityBar';
import LegalDisclaimer from './components/LegalDisclaimer/LegalDisclaimer';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Create RTL cache for MUI components
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <Router>
        <div dir="rtl" lang="he" className="app">
          <LegalDisclaimer />
          <Header onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />

          {/* ADD THE SIDEBAR HERE */}
          <Sidebar open={isMenuOpen} onClose={handleSidebarClose} />
          <AccessibilityBar />

          <main style={{ flex: '1 0 auto' }} className="main-content">
            <ScrollToTop />
            <Routes>
              {AppRoutes.map((route: AppRoute) => {
                const canonicalPath: string = route.seo?.canonicalPath ?? route.path;

                const element: React.ReactElement = route.seo ? (
                  <SeoRoute
                    title={route.seo.title}
                    description={route.seo.description}
                    path={canonicalPath}
                    noIndex={route.seo.noIndex}
                  >
                    {route.component}
                  </SeoRoute>
                ) : (
                  route.component
                );

                return (
                  <Route
                    key={route.path}
                    element={element}
                    path={route.path}
                  />
                );
              })}
            </Routes>
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </CacheProvider>
  );
}

export default App;