import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { BrowserRouter as Router } from 'react-router-dom';

// Components
import { Header } from './components/layout';

// Styles
import './styles/main.scss';
import './App.scss';

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
          
          <main className="main-content">
            {/* Temporary placeholder content */}
            <div className="placeholder-content">
              <h1>🧠 PANS/PANDAS Israel</h1>
              <p className="subtitle">
                קהילת הורים לילדים עם PANDAS/PANS בישראל
              </p>
              <p className="status">
                Step 2 Complete ✓ - Header with responsive layout
              </p>
            </div>
          </main>
        </div>
      </Router>
    </CacheProvider>
  );
}

export default App;