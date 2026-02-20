import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import logoPng from '../../styles/assets/logo.png';
import './Header.scss';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  path?: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'תסמינים ואבחון',
    children: [
      { label: 'סקירה כללית', path: '/info/overview' },
      { label: 'תסמינים נפוצים', path: '/info/symptoms' },
      { label: 'אבחון', path: '/info/diagnosis' },
      { label: 'כלי הערכה', path: '/info/scales' },
    ],
  },
  {
    label: 'אפשרויות טיפול',
    children: [
      { label: 'דרכי טיפול', path: '/info/treatment' },
      { label: 'רשימת רופאים ומטפלים', path: '/Professionals-help' },
      { label: 'רפואה משלימה', path: '/Professionals-help?tab=holistic' },
    ],
  },
  {
    label: 'תמיכה וקהילה',
    children: [
      { label: 'משאבים להורים', path: '/resources/parents' },
      { label: 'תמיכה וקהילה', path: '/support' },
      { label: 'עדויות הורים', path: '/testimonials' },
      { label: 'סרטונים ווובינרים', path: '/resources/videos' },
    ],
  },
  {
    label: 'מידע מקצועי',
    children: [
      { label: 'אבחון וטיפול', path: '/professional/diagnosis' },
      { label: 'מידע לצוות חינוכי', path: '/professional/education' },
      { label: 'מאמרים מדעיים', path: '/professional/articles' },
      { label: 'אתרים בינלאומיים', path: '/professional/international' },
      { label: 'מחקרים קליניים', path: '/professional/research' },
      { label: 'סקרים', path: '/professional/surveys' },
    ],
  },
  {
    label: 'העמותה',
    path: '/about',
  },
];

const WHATSAPP_URL =
  'https://wa.me/972544767146?text=' +
  encodeURIComponent(
    'שלום,\nאני יוצר/ת קשר דרך אתר פאנס/פאנדס - העמותה הישראלית לאנספיליטיס אוטואימוני.\nאשמח לשוחח בנושא:'
  );

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen = false }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpenDropdown(null); }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) return location.pathname === item.path;
    return item.children?.some(c => location.pathname === c.path.split('?')[0]) ?? false;
  };

  return (
    <header ref={headerRef} className={`header${isScrolled ? ' header--scrolled' : ''}`}>
      <div className="header__container">

        <a href="/" className="header__logo">
          <img src={logoPng} className="header__logo-icon" alt="לוגו" />
          <div className="header__logo-text">
            <span className="header__logo-title">פאנס/פאנדס</span>
            <span className="header__logo-subtitle">ישראל</span>
          </div>
        </a>

        <nav className="header__nav" aria-label="ניווט ראשי">
          {NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isActive = isItemActive(item);
            const isOpen = openDropdown === item.label;

            return (
              <div
                key={item.label}
                className={[
                  'header__nav-item',
                  hasChildren ? 'header__nav-item--has-dropdown' : '',
                  isActive ? 'header__nav-item--active' : '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => hasChildren && openMenu(item.label)}
                onMouseLeave={closeMenu}
              >
                {item.path && !hasChildren ? (
                  <a href={item.path} className={`header__nav-link${isActive ? ' header__nav-link--active' : ''}`}>
                    {item.label}
                  </a>
                ) : (
                  <button
                    className={[
                      'header__nav-link header__nav-link--btn',
                      isOpen ? 'header__nav-link--open' : '',
                      isActive ? 'header__nav-link--active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <FiChevronDown className="header__nav-chevron" />
                  </button>
                )}

                {hasChildren && (
                  <div
                    className={`header__dropdown${isOpen ? ' header__dropdown--open' : ''}`}
                    onMouseEnter={() => openMenu(item.label)}
                    onMouseLeave={closeMenu}
                    role="menu"
                  >
                    <ul className="header__dropdown-list">
                      {item.children!.map((child) => {
                        const childActive = location.pathname === child.path.split('?')[0];
                        return (
                          <li key={child.path} role="none">
                            <a
                              href={child.path}
                              role="menuitem"
                              className={`header__dropdown-link${childActive ? ' header__dropdown-link--active' : ''}`}
                            >
                              {child.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <a href={WHATSAPP_URL} className="header__cta" target="_blank" rel="noopener noreferrer" aria-label="צור קשר בוואטסאפ">
            <FaWhatsapp />
            <span>צור קשר</span>
          </a>
        </nav>

        <button
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

      </div>
    </header>
  );
};

export default Header;