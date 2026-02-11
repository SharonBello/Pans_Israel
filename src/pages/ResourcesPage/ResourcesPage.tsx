import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import {
  Favorite as DonateIcon,
  Groups as CommunityIcon,
  Email as ContactIcon,
} from '@mui/icons-material';
import ResourcesTabs from '../../components/Resources/ResourcesTabs/ResourcesTabs';

import research1 from '../../styles/assets/resources/research-1.png';
import research2 from '../../styles/assets/resources/research-2.png';
import research3 from '../../styles/assets/resources/research-3.png';
import doctors from '../../styles/assets/resources/doctors.jpg';
import parents from '../../styles/assets/resources/parents.jpg';
import educators from '../../styles/assets/resources/educators.jpg';
import clinicians from '../../styles/assets/resources/clinicians.jpg';
import './ResourcesPage.scss';

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  const openPdf = (pdfPath: string): void => {
    window.open(pdfPath, '_blank', 'noopener,noreferrer')
  };

  return (
    <Box className="resources-page" dir="rtl">
      {/* ===== HERO SECTION ===== */}
      {/* <section className="resources-page__hero">
        <div className="resources-page__hero-bg" />
        <div className="resources-page__hero-content">
          <Typography variant="h1" className="resources-page__hero-title">
            משאבי <span>פאנס/פאנדס</span>
          </Typography>
        </div>
      </section> */}

      {/* ===== TABS NAVIGATION ===== */}
      <ResourcesTabs currentPage="overview" />

      {/* ===== LATEST RESEARCH SECTION ===== */}
      <section className="resources-page__section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="resources-page__section-title">
            מחקרים קליניים
          </Typography>

          <div className="resources-page__cards-row">
            <article
              className="resources-page__card"
              onClick={() => openPdf('/pdfs/ivig-pans-6mo.pdf')}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' || e.key === ' ') openPdf('/pdfs/ivig-pans-6mo.pdf');
              }}
            >
              <div className="resources-page__card-image">
                <img src={research1} alt="מחקר IVIG" />
              </div>
              <h3 className="resources-page__card-title">
                טיפול IVIG מורחב מראה יעילות ב-21 צעירים עם PANS במשך 6 חודשים
              </h3>
            </article>

            <article
              className="resources-page__card"
              onClick={() => openPdf('/pdfs/ae-clinician-guide.pdf')}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' || e.key === ' ') openPdf('/pdfs/ae-clinician-guide.pdf');
              }}
            >
              <div className="resources-page__card-image">
                <img src={research2} alt="מדריך לרופאים" />
              </div>
              <h3 className="resources-page__card-title">
                דלקת מוח אוטואימונית: מדריך לרופאים לספקטרום הקליני, אבחון וניהול
              </h3>
            </article>

            <article
              className="resources-page__card"
              onClick={() => openPdf('/pdfs/infection-psych-children.pdf')}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' || e.key === ' ') openPdf('/pdfs/infection-psych-children.pdf');
              }}
            >
              <div className="resources-page__card-image">
                <img src={research3} alt="זיהומים ומחלות פסיכיאטריות" />
              </div>
              <h3 className="resources-page__card-title">
                כיצד זיהומים נפוצים יכולים לעורר מחלות פסיכיאטריות בילדים
              </h3>
            </article>
          </div>
        </Container>
      </section>

      {/* ===== FIND A DOCTOR SECTION ===== */}
      <section className="resources-page__section resources-page__section--gray">
        <Container maxWidth="lg">
          <div className="resources-page__split resources-page__split--text-first">
            <div className="resources-page__split-text">
              <Typography variant="h2" className="resources-page__section-title">
                מצא רופא מומחה
              </Typography>
              <Typography className="resources-page__text">
                חפשו במאגר שלנו כדי למצוא מטפל עם ניסיון בסיוע למטופלים עם תסמינים הקשורים ל-פאנס/פאנדס.
              </Typography>
            </div>
              <Button
                className="resources-page__link-btn"
                onClick={() => navigate('/Professionals-help')}
              >
                {/* מצא עזרה &gt; */}
                <img src={doctors} alt="מצא רופא" />
              </Button>
          </div>
        </Container>
      </section>

      {/* ===== LATEST NEWS SECTION ===== */}
      {/* <section className="resources-page__section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="resources-page__section-title">
            חדשות אחרונות
          </Typography>
          <Typography className="resources-page__section-subtitle">
            גלו את החדשות והמידע האחרונים הנוגעים לטיפול, אבחון ומודעות ל-פאנס/פאנדס
          </Typography>

          <div className="resources-page__cards-row">
            <article className="resources-page__card" onClick={() => navigate('/resources/news')}>
              <div className="resources-page__card-image">
                <img src="/images/resources/news-1.jpg" alt="כתבת חדשות" />
              </div>
              <h3 className="resources-page__card-title">
                זיהום סטרפ השאיר ילד עם תסמינים פסיכיאטריים חמורים. משפחתו יצאה למסע לתשובות והחלמה
              </h3>
              <span className="resources-page__card-source">חדשות בריאות, 2024</span>
            </article>

            <article className="resources-page__card" onClick={() => navigate('/resources/news')}>
              <div className="resources-page__card-image">
                <img src="/images/resources/news-2.jpg" alt="כתבת חדשות" />
              </div>
              <h3 className="resources-page__card-title">
                משפחה נאבקה וזכתה בכיסוי ביטוחי לטיפול במצב נדיר של בתם
              </h3>
              <span className="resources-page__card-source">חדשות רפואיות, 2024</span>
            </article>

            <article className="resources-page__card" onClick={() => navigate('/resources/news')}>
              <div className="resources-page__card-image">
                <img src="/images/resources/news-3.jpg" alt="כתבת חדשות" />
              </div>
              <h3 className="resources-page__card-title">
                "המוח שלי גורם לי לעשות את זה": משפחה נאבקת על כיסוי ביטוחי למחלת מוח
              </h3>
              <span className="resources-page__card-source">כתבה מיוחדת, 2024</span>
            </article>
          </div>
        </Container>
      </section> */}

      {/* ===== PARENT RESOURCES SECTION ===== */}
      <section className="resources-page__section resources-page__section--gray">
        <Container maxWidth="lg">
          <div className="resources-page__split resources-page__split--image-first">
            <div className="resources-page__split-image">
              <img src={parents} alt="משאבים להורים" />
            </div>
            <div className="resources-page__split-text">
              <Typography variant="h2" className="resources-page__section-title">
                משאבים להורים
              </Typography>
              <Typography className="resources-page__text">
                מרשימות מטפלים ועד סיפורי חיים אמיתיים, גלו את כל המשאבים שלנו להורים שיעזרו לכם לטפל בילדכם החי עם פאנס/פאנדס ולהעלות מודעות בקהילה שלכם.
              </Typography>
              <Button
                className="resources-page__link-btn"
                onClick={() => navigate('/resources/parents')}
              >
                למידע נוסף &gt;
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== CLINICIAN RESOURCES SECTION ===== */}
      <section className="resources-page__section">
        <Container maxWidth="lg">
          <div className="resources-page__split resources-page__split--text-first">
            <div className="resources-page__split-text">
              <Typography variant="h2" className="resources-page__section-title">
                משאבים לאנשי מקצוע
              </Typography>
              <Typography className="resources-page__text">
                הישארו מעודכנים במידע האחרון על הנחיות אבחון, מחקר פורץ דרך, אפשרויות טיפול יעילות, דרכים להתחבר לקולגות בתחום ועוד.
              </Typography>
              <Button
                className="resources-page__link-btn"
                onClick={() => navigate('/resources/clinicians')}
              >
                למידע נוסף &gt;
              </Button>
            </div>
            <div className="resources-page__split-image">
              <img src={clinicians} alt="משאבים לאנשי מקצוע" />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== EDUCATOR RESOURCES SECTION ===== */}
      <section className="resources-page__section resources-page__section--gray">
        <Container maxWidth="lg">
          <div className="resources-page__split resources-page__split--image-first">
            <div className="resources-page__split-image">
              <img src={educators} alt="משאבים למחנכים" />
            </div>
            <div className="resources-page__split-text">
              <Typography variant="h2" className="resources-page__section-title">
                משאבים למחנכים
              </Typography>
              <Typography className="resources-page__text">
                קבלו גישה למידע ותובנות על חינוך ילדים וצעירים בכיתה עם פאנס/פאנדס.
              </Typography>
              <Button
                className="resources-page__link-btn"
                onClick={() => navigate('/resources/educators')}
              >
                למידע נוסף &gt;
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== SUPPORT CTA SECTION ===== */}
      <section className="resources-page__section resources-page__section--cta">
        <Container maxWidth="lg">
          <Typography variant="h2" className="resources-page__section-title resources-page__section-title--center">
            תמכו במשימה שלנו
          </Typography>
          <p className="resources-page__section-subtitle resources-page__section-subtitle--center">
            עזרו לנו להמשיך לתמוך בילדים ומבוגרים החיים עם פאנס/פאנדס
          </p>

          <div className="resources-page__cta-row">
            <div className="resources-page__cta-card">
              <div className="resources-page__cta-icon">
                <DonateIcon />
              </div>
              <h4 className="resources-page__cta-title">תרומה</h4>
              <p className="resources-page__cta-text">תמכו במחקר ובתמיכה קריטית למשפחות.</p>
              <Button
                className="resources-page__cta-btn"
                onClick={() => navigate('/donate')}
              >
                לתרומה
              </Button>
            </div>

            <div className="resources-page__cta-card">
              <div className="resources-page__cta-icon">
                <CommunityIcon />
              </div>
              <h4 className="resources-page__cta-title">הצטרפו אלינו</h4>
              <p className="resources-page__cta-text">עזרו לנו להפיץ מודעות על פאנס/פאנדס.</p>
              <Button
                className="resources-page__cta-btn"
                onClick={() => navigate('/community')}
              >
                להצטרפות
              </Button>
            </div>

            <div className="resources-page__cta-card">
              <div className="resources-page__cta-icon">
                <ContactIcon />
              </div>
              <h4 className="resources-page__cta-title">צרו קשר</h4>
              <p className="resources-page__cta-text">פנו לצוות שלנו לקבלת מידע נוסף על פאנס/פאנדס.</p>
              <Button
                className="resources-page__cta-btn"
                onClick={() => navigate('/contact')}
              >
                ליצירת קשר
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Box>
  );
};

export default ResourcesPage;
