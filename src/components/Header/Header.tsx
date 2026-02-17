import { FiMenu, FiX } from 'react-icons/fi';
import logoPng from '../../styles/assets/logo.png';
import './Header.scss';
import { FaWhatsapp } from 'react-icons/fa';

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
          <img src={logoPng} className="header__logo-icon" alt="logo" />
          <div className="header__logo-text">
            <span className="header__logo-title">פאנס/פאנדס</span>
            <span className="header__logo-subtitle">ישראל</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <a href="/about" className="header__nav-link">אודות</a>
          <a href="/info" className="header__nav-link">מידע</a>
          <a href="/Professionals-help" className="header__nav-link">מטפלים</a>
          <a href="/support" className="header__nav-link">תמיכה</a>
          <a href="/resources" className="header__nav-link">משאבים</a>
          {/* <a href="/surveys" className="header__nav-link">סקרים</a> */}
          <a
            href="https://wa.me/972544767146"
            className="hero__btn hero__btn--primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="דברו איתנו בוואטסאפ"
          >
            <span>צור קשר</span>
            <FaWhatsapp />
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