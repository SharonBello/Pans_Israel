import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Components
import Header from './components/Header';
// import { Hero } from './components/sections';

// Styles
import './styles/main.scss';
import './App.scss';
// import HomeSections from './components/sections/HomeSections/HomeSections';

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

  return (
    <CacheProvider value={cacheRtl}>
      <Router>
        <div dir="rtl" lang="he" className="app">
          <Header onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />

          {/* <main className="main-content">
            <Hero />
            <HomeSections /> */}

          {/* Placeholder for more sections */}
          {/* <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <p style={{ color: '#6CA6D9' }}>
                Step 3 Complete ✓ - Hero with Neural Network Particles
              </p>
            </section>
          </main> */}
          <main style={{ flex: '1 0 auto' }} className="main-content">
            <Routes>
              {AppRoutes.map((route) => (
                <Route key={route.path} element={route.component} path={route.path} />
              ))}
            </Routes>
          </main>
        </div>
      </Router>
    </CacheProvider>
  );
}

export default App;