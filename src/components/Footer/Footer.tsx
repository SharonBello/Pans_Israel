import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import './Footer.scss';
import logoPng from '../../styles/assets/logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { title: 'דף הבית', path: '/' },
    { title: 'אודות', path: '/about' },
    { title: 'מידע', path: '/info' },
    { title: 'תמיכה', path: '/support' },
    { title: 'משאבים', path: '/resources' },
    { title: 'סקרים', path: '/surveys' },
  ];

  // Minimal links for mobile (most important pages only)
  const mobileEssentialLinks = [
    { title: 'דף הבית', path: '/' },
    { title: 'מידע', path: '/info' },
    { title: 'תמיכה', path: '/support' },
    { title: 'צור קשר', path: '/contact' },
  ];

  const infoLinks = [
    { title: 'מה זה PANS/PANDAS?', path: '/info' },
    { title: 'סימנים ותסמינים', path: '/info/symptoms' },
    { title: 'אבחון', path: '/info/diagnosis' },
    { title: 'טיפול', path: '/info/treatment' },
  ];

  const supportLinks = [
    { title: 'עדויות הורים', path: '/testimonials' },
    { title: 'אנשי מקצוע', path: '/professionals-help' },
    { title: 'זכויות וסיוע', path: '/support' },
    { title: 'קהילה', path: '/support#community' },
  ];

  return (
    <footer className="footer" dir="rtl">
      <div className="footer__container">
        {/* Top Section */}
        <div className="footer__top">
          {/* Logo & Description */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src={logoPng} alt="PANS/PANDAS Israel Logo" className="footer__logo-img" />
              <div className="footer__logo-text">
                <span className="footer__logo-title">פאנס/פאנדס</span>
                <span className="footer__logo-subtitle">ישראל</span>
              </div>
            </div>
            <p className="footer__description">
              העמותה הישראלית לאנצפליטיס אוטואימוני של גרעיני הבסיס במוח.
              <br />
              תמיכה, מידע ומשאבים למשפחות המתמודדות עם PANS/PANDAS.
            </p>
            {/* Social Links */}
            <div className="footer__social">
              <a
                href="https://wa.me/972544767146"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link footer__social-link--whatsapp"
                aria-label="דברו איתנו בוואטסאפ"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.facebook.com/share/g/1DCWNUxKhN/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link footer__social-link--facebook"
                aria-label="הצטרפו לקבוצת הפייסבוק"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Desktop/Tablet Navigation - 3 columns */}
          <div className="footer__links footer__links--desktop">
            <div className="footer__links-column">
              <h3 className="footer__links-title">ניווט</h3>
              <ul className="footer__links-list">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">מידע</h3>
              <ul className="footer__links-list">
                {infoLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">תמיכה</h3>
              <ul className="footer__links-list">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Navigation - Minimal essential links only */}
          <div className="footer__links footer__links--mobile">
            <div className="footer__links-column">
              <h3 className="footer__links-title">קישורים חשובים</h3>
              <ul className="footer__links-list">
                {mobileEssentialLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {currentYear} פאנס/פאנדס ישראל. כל הזכויות שמורות.
            </p>
            <p className="footer__developer">
              פותח על ידי{' '}
              <a
                href="https://www.linkedin.com/in/sharon-bello"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__developer-link"
              >
                Sharon Bello
              </a>
              {' '}@{' '}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="footer__developer-link"
              >
                Sigmax Ltd
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;