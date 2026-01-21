import { FiMenu, FiX } from 'react-icons/fi';
import './Header.scss';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen = false }) => {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <a href="/" className="header__logo">
          <div className="header__logo-icon">🧠</div>
          <div className="header__logo-text">
            <span className="header__logo-title">PANS/PANDAS</span>
            <span className="header__logo-subtitle">Israel</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <a href="#about" className="header__nav-link">אודות</a>
          <a href="#info" className="header__nav-link">מידע</a>
          <a href="#support" className="header__nav-link">תמיכה</a>
          <a href="#resources" className="header__nav-link">משאבים</a>
          <a href="#contact" className="header__nav-link header__nav-link--cta">
            צור קשר
          </a>
        </nav>

        {/* Mobile Menu Button */}
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