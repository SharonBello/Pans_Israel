import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import AppRoutes from './routes';
import type { AppRoute } from './routes';
import { SeoRoute } from './components/SEO/SeoRoute';

import Header from './components/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer';
import { AccessibilityBar } from './components/AccessibilityBar';
import LegalDisclaimer from './components/LegalDisclaimer/LegalDisclaimer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import './styles/main.scss';
import './App.scss';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

/** Inside <Router> so useLocation works */
function Shell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div dir="rtl" lang="he" className={`app${isAdmin ? ' app--admin' : ''}`}>
      {!isAdmin && (
        <>
          <LegalDisclaimer />
          <Header onMenuToggle={() => setIsMenuOpen((prev) => !prev)} isMenuOpen={isMenuOpen} />
          <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <AccessibilityBar />
        </>
      )}

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

      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <Router>
        <Shell />
      </Router>
    </CacheProvider>
  );
}

export default App;