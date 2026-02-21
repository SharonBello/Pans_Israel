import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import './Footer.scss';
import logoPng from '../../styles/assets/logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // ── Column 1: mirrors "תסמינים ואבחון" + "אפשרויות טיפול" from header ──
  const infoLinks = [
    { title: 'מה זה פאנס/פאנדס?', path: '/info' },
    { title: 'תסמינים נפוצים', path: '/info/symptoms' },
    { title: 'אבחון', path: '/info/diagnosis' },
    { title: 'כלי הערכה', path: '/info/scales' },
    { title: 'דרכי טיפול', path: '/info/treatment' },
  ];

  // ── Column 2: mirrors "תמיכה וקהילה" from header ──
  const supportLinks = [
    { title: 'משאבים להורים', path: '/resources' },
    { title: 'תמיכה וקהילה', path: '/support' },
    { title: 'עדויות הורים', path: '/testimonials' },
    { title: 'סרטונים ווובינרים', path: '/resources/videos' },
    { title: 'רשימת רופאים ומטפלים', path: '/Professionals-help' },
  ];

  // ── Column 3: mirrors "מידע מקצועי" from header ──
  const professionalLinks = [
    { title: 'אבחון וטיפול', path: '/professional/diagnosis' },
    { title: 'מידע לצוות חינוכי', path: '/professional/education' },
    { title: 'מאמרים מדעיים', path: '/professional/articles' },
    { title: 'מחקרים קליניים', path: '/professional/research' },
    { title: 'אתרים בינלאומיים', path: '/professional/international' },
    { title: 'סקרים', path: '/professional/surveys' },
  ];

  // ── Mobile: only the most critical pages ──
  const mobileEssentialLinks = [
    { title: 'דף הבית', path: '/' },
    { title: 'מידע', path: '/info' },
    { title: 'תמיכה', path: '/support' },
    { title: 'אודות', path: '/about' },
  ];

  const WHATSAPP_URL =
    'https://wa.me/972544767146?text=' +
    encodeURIComponent(
      'שלום,\nאני יוצר/ת קשר דרך אתר פאנס/פאנדס - העמותה הישראלית לאנספיליטיס אוטואימוני.\nאשמח לשוחח בנושא:'
    );

  return (
    <footer className="footer" dir="rtl">
      <div className="footer__container">

        {/* ── TOP SECTION ─────────────────────────────────────────────── */}
        <div className="footer__top">

          {/* Brand / Logo / Description / Social */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src={logoPng} alt="פאנס/פאנדס Israel Logo" className="footer__logo-img" />
              <div className="footer__logo-text">
                <span className="footer__logo-title">פאנס/פאנדס</span>
                <span className="footer__logo-subtitle">ישראל</span>
              </div>
            </div>
            <p className="footer__description">
              העמותה הישראלית לאנצפליטיס אוטואימוני של גרעיני הבסיס במוח.
              <br />
              תמיכה, מידע ומשאבים למשפחות המתמודדות עם פאנס/פאנדס.
            </p>
            <div className="footer__social">
              <a
                href={WHATSAPP_URL}
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

          {/* ── DESKTOP: 3 link columns ─────────────────────────────── */}
          <div className="footer__links footer__links--desktop">

            <div className="footer__links-column">
              <h3 className="footer__links-title">מידע ואבחון</h3>
              <ul className="footer__links-list">
                {infoLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">תמיכה וקהילה</h3>
              <ul className="footer__links-list">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-column">
              <h3 className="footer__links-title">מידע מקצועי</h3>
              <ul className="footer__links-list">
                {professionalLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── MOBILE: condensed single column ─────────────────────── */}
          <div className="footer__links footer__links--mobile">
            <div className="footer__links-column">
              <h3 className="footer__links-title">קישורים חשובים</h3>
              <ul className="footer__links-list">
                {mobileEssentialLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ── BOTTOM SECTION ──────────────────────────────────────────── */}
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
                href="https://www.sigmaxltd.com"
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