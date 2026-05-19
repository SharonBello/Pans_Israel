import React from 'react';

import HomePage from './pages/HomePage/HomePage.tsx';
import SymptomsPage from './pages/SymptomsPage/SymptomsPage.tsx';
import TestimonialsPage from './pages/TestimonialsPage/TestimonialsPage.tsx';
import ProfessionalsHelpPage from './pages/MedicalHelpPage/ProfessionalsHelpPage.tsx';
import PandasScalePage from './pages/SymptomsPage/scales/PANDASScale/PandasScalePage/PandasScalePage.tsx';
import PandasScaleResultsPage from './pages/SymptomsPage/scales/PANDASScale/PandasScaleResultsPage/PandasScaleResultsPage.tsx';
import PandasScaleHomePage from './pages/SymptomsPage/scales/PANDASScale/PandasScaleHomePage/PandasScaleHomePage.tsx';
import KovacevicHomePage from './pages/SymptomsPage/scales/KovacevicScale/KovacevicHomePage/KovacevicHomePage.tsx';
import KovacevicScalePage from './pages/SymptomsPage/scales/KovacevicScale/KovacevicScalePage/KovacevicScalePage.tsx';
import KovacevicResultsPage from './pages/SymptomsPage/scales/KovacevicScale/KovacevicResultsPage/KovacevicResultsPage.tsx';
import PTECHomePage from './pages/SymptomsPage/scales/PTECScale/PTECHomePage/PTECHomePage.tsx';
import PTECScalePage from './pages/SymptomsPage/scales/PTECScale/PTECScalePage/PTECScalePage.tsx';
import PTECResultsPage from './pages/SymptomsPage/scales/PTECScale/PTECResultsPage/PTECResultsPage.tsx';
import PANS31HomePage from './pages/SymptomsPage/scales/PANS31Scale/PANS31HomePage/PANS31HomePage.tsx';
import PANS31ScalePage from './pages/SymptomsPage/scales/PANS31Scale/PANS31ScalePage/PANS31ScalePage.tsx';
import PANS31ResultsPage from './pages/SymptomsPage/scales/PANS31Scale/PANS31ResultsPage/PANS31ResultsPage.tsx';
import CBIHomePage from './pages/SymptomsPage/scales/CbiScale/CBIHomePage/CBIHomePage.tsx';
import CBIScalePage from './pages/SymptomsPage/scales/CbiScale/CBIScalePage/CBIScalePage.tsx';
import CBIResultsPage from './pages/SymptomsPage/scales/CbiScale/CBIResultsPage/CBIResultsPage.tsx';
import AboutPage from './pages/AboutPage/AboutPage.tsx';
import { SOCAdminPage, SOCResultsPage, SOCSurveyPage } from './features/index.ts';
import ProfessionalSurveysPage from './pages/ProfessionalPages/ProfessionalSurveysPage/ProfessionalSurveysPage.tsx';
import InfoPage from './pages/InfoPage/InfoPage.tsx';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage.tsx';
import ResourcesDetailPage from './pages/ResourcesPage/ResourcesDetailPage/ResourcesDetailPage.tsx';
import SupportPage from './pages/SupportPage/SupportPage.tsx';
import HolisticPage from './pages/HolisticPage/HolisticPage.tsx';
import VideosPage from './pages/VideosPage/VideosPage.tsx';
import DiagnosisPage from './pages/ProfessionalPages/DiagnosisPage/DiagnosisPage.tsx';
import EducationPage from './pages/ProfessionalPages/EducationPage/EducationPage.tsx';
import ArticlesPage from './pages/ProfessionalPages/ArticlesPage/ArticlesPage.tsx';
import InternationalPage from './pages/ProfessionalPages/InternationalPage/InternationalPage.tsx';
import ResearchPage from './pages/ProfessionalPages/ResearchPage/ResearchPage.tsx';

// ── Admin Auth ────────────────────────────────────────────────────────────────
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage.tsx';
import ProtectedRoute from './Auth/ProtectedRoute.tsx';
import BlogListPage from './pages/CommunityBlog/BlogListPage/BlogListPage.tsx';
import BlogArticlePage from './pages/CommunityBlog/BlogArticlePage/BlogArticlePage.tsx';
import PdfAdminPage from './pages/PdfAdminPage/PdfAdminPage.tsx';
import MediaCoveragePage from './pages/MediaCoveragePage/MediaCoveragePage.tsx';
import MediaArticlesAdmin from './pages/MediaArticlesAdmin/MediaArticlesAdmin.tsx';

// ─────────────────────────────────────────────────────────────────────────────

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
};

export type AppRoute = {
  path: string;
  component: React.ReactElement;
  seo?: SeoConfig;
};

// ─────────────────────────────────────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────────────────────────────────────

const AppRoutes: AppRoute[] = [
  {
    path: '/',
    component: <HomePage />,
    seo: {
      title: 'פאנס/פאנדס ישראל | מידע, תמיכה והעלאת מודעות',
      description:
        'פאנס/פאנדס ישראל מספקת מידע, תמיכה ומשאבים להורים, משפחות, אנשי חינוך ואנשי מקצוע המתמודדים עם תסמונות PANS ו-PANDAS.',
      canonicalPath: '/',
    },
  },
  {
    path: '/about',
    component: <AboutPage />,
    seo: {
      title: 'על העמותה | פאנס/פאנדס ישראל',
      description:
        'מידע על פאנס/פאנדס ישראל, מטרות העמותה, פעילות הקהילה והחזון להעלאת מודעות, אבחון, טיפול ותמיכה.',
      canonicalPath: '/about',
    },
  },
  {
    path: '/info',
    component: <InfoPage />,
    seo: {
      title: 'מידע על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע נגיש על תסמונות פאנס ופאנדס, תסמינים, אבחון, טיפול, סולמות הערכה ומשאבים למשפחות.',
      canonicalPath: '/info',
    },
  },
  {
    path: '/info/scales',
    component: <InfoPage />,
    seo: {
      title: 'סולמות הערכה לפאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע על סולמות הערכה ושאלונים המסייעים להורים ולאנשי מקצוע להבין תסמינים ועומס משפחתי סביב פאנס ופאנדס.',
      canonicalPath: '/info/scales',
    },
  },
  {
    path: '/info/:pageId',
    component: <InfoPage />,
    seo: {
      title: 'מידע על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע מקצועי ונגיש על פאנס ופאנדס, כולל תסמינים, אבחון, טיפול, תמיכה ומשאבים למשפחות.',
      canonicalPath: '/info',
    },
  },
  {
    path: '/symptoms',
    component: <SymptomsPage />,
    seo: {
      title: 'תסמינים של פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע על תסמינים אפשריים של פאנס ופאנדס, כולל OCD פתאומי, חרדה, שינויים התנהגותיים, קשיי למידה ותסמינים גופניים.',
      canonicalPath: '/symptoms',
    },
  },
  {
    path: '/professionals-help',
    component: <ProfessionalsHelpPage />,
    seo: {
      title: 'עזרה מאנשי מקצוע | פאנס/פאנדס ישראל',
      description:
        'מידע למשפחות המחפשות עזרה מקצועית, הכוונה ומשאבים בתחום פאנס ופאנדס.',
      canonicalPath: '/professionals-help',
    },
  },
  {
    path: '/resources',
    component: <ResourcesPage />,
    seo: {
      title: 'משאבים להורים ואנשי מקצוע | פאנס/פאנדס ישראל',
      description:
        'מאגר משאבים, מדריכים, סרטונים וחומרי הסברה בנושא פאנס ופאנדס בישראל להורים, משפחות ואנשי מקצוע.',
      canonicalPath: '/resources',
    },
  },
  {
    path: '/resources/:pageId',
    component: <ResourcesDetailPage />,
    seo: {
      title: 'משאבים בנושא פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'משאבים, מדריכים וחומרי הסברה להורים, משפחות ואנשי מקצוע בנושא פאנס ופאנדס.',
      canonicalPath: '/resources',
    },
  },
  {
    path: '/support',
    component: <SupportPage />,
    seo: {
      title: 'תמיכה למשפחות | פאנס/פאנדס ישראל',
      description:
        'מידע על אפשרויות תמיכה, קהילה, ליווי ומשאבים למשפחות המתמודדות עם פאנס ופאנדס.',
      canonicalPath: '/support',
    },
  },
  {
    path: '/testimonials',
    component: <TestimonialsPage />,
    seo: {
      title: 'סיפורי משפחות ועדויות | פאנס/פאנדס ישראל',
      description:
        'עדויות וסיפורים אישיים של משפחות המתמודדות עם פאנס ופאנדס, במטרה להעלות מודעות ולתת תמיכה ותקווה.',
      canonicalPath: '/testimonials',
    },
  },
  // Scales
  // Scales
  {
    path: '/scales/pandas',
    component: <PandasScaleHomePage />,
    seo: {
      title: 'שאלון PANDAS | פאנס/פאנדס ישראל',
      description:
        'שאלון הערכה ראשוני להורים בנושא תסמינים אפשריים הקשורים לפאנדס. השאלון אינו מחליף אבחון רפואי.',
      canonicalPath: '/scales/pandas',
    },
  },
  {
    path: '/scales/pandas/scales-page',
    component: <PandasScalePage />,
    seo: {
      title: 'מילוי שאלון PANDAS | פאנס/פאנדס ישראל',
      description:
        'עמוד מילוי שאלון PANDAS להורים, לצורך התבוננות ראשונית בתסמינים ובשינויים התנהגותיים.',
      canonicalPath: '/scales/pandas/scales-page',
    },
  },
  {
    path: '/scales/pandas/results',
    component: <PandasScaleResultsPage />,
    seo: {
      title: 'תוצאות שאלון PANDAS | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות שאלון PANDAS.',
      canonicalPath: '/scales/pandas/results',
      noIndex: true,
    },
  },
  {
    path: '/scales/kovacevic',
    component: <KovacevicHomePage />,
    seo: {
      title: 'שאלון קובצ׳ביץ׳ | פאנס/פאנדס ישראל',
      description:
        'מידע ושאלון הערכה המבוסס על סולם קובצ׳ביץ׳ לתסמינים הקשורים לפאנס ופאנדס.',
      canonicalPath: '/scales/kovacevic',
    },
  },
  {
    path: '/scales/kovacevic/form',
    component: <KovacevicScalePage />,
    seo: {
      title: 'מילוי שאלון קובצ׳ביץ׳ | פאנס/פאנדס ישראל',
      description:
        'עמוד מילוי שאלון קובצ׳ביץ׳ להערכה ראשונית של תסמינים ועומס סביב פאנס ופאנדס.',
      canonicalPath: '/scales/kovacevic/form',
    },
  },
  {
    path: '/scales/kovacevic/results',
    component: <KovacevicResultsPage />,
    seo: {
      title: 'תוצאות שאלון קובצ׳ביץ׳ | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות שאלון קובצ׳ביץ׳.',
      canonicalPath: '/scales/kovacevic/results',
      noIndex: true,
    },
  },
  {
    path: '/scales/ptec',
    component: <PTECHomePage />,
    seo: {
      title: 'שאלון PTEC | פאנס/פאנדס ישראל',
      description:
        'שאלון PTEC להערכה ראשונית ותיעוד תסמינים אצל ילדים המתמודדים עם פאנס ופאנדס.',
      canonicalPath: '/scales/ptec',
    },
  },
  {
    path: '/scales/ptec/form',
    component: <PTECScalePage />,
    seo: {
      title: 'מילוי שאלון PTEC | פאנס/פאנדס ישראל',
      description:
        'עמוד מילוי שאלון PTEC להורים ולמשפחות לצורך תיעוד והבנה ראשונית של תסמינים.',
      canonicalPath: '/scales/ptec/form',
    },
  },
  {
    path: '/scales/ptec/results',
    component: <PTECResultsPage />,
    seo: {
      title: 'תוצאות שאלון PTEC | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות שאלון PTEC.',
      canonicalPath: '/scales/ptec/results',
      noIndex: true,
    },
  },
  {
    path: '/scales/pans31',
    component: <PANS31HomePage />,
    seo: {
      title: 'שאלון PANS 31 | פאנס/פאנדס ישראל',
      description:
        'שאלון PANS 31 להערכה ראשונית של תסמינים אפשריים הקשורים לפאנס.',
      canonicalPath: '/scales/pans31',
    },
  },
  {
    path: '/scales/pans31/form',
    component: <PANS31ScalePage />,
    seo: {
      title: 'מילוי שאלון PANS 31 | פאנס/פאנדס ישראל',
      description:
        'עמוד מילוי שאלון PANS 31 לצורך תיעוד תסמינים והבנת התמונה המשפחתית והקלינית.',
      canonicalPath: '/scales/pans31/form',
    },
  },
  {
    path: '/scales/pans31/results',
    component: <PANS31ResultsPage />,
    seo: {
      title: 'תוצאות שאלון PANS 31 | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות שאלון PANS 31.',
      canonicalPath: '/scales/pans31/results',
      noIndex: true,
    },
  },
  {
    path: '/scales/cbi',
    component: <CBIHomePage />,
    seo: {
      title: 'שאלון עומס מטפל CBI | פאנס/פאנדס ישראל',
      description:
        'שאלון CBI להערכת עומס מטפל בקרב משפחות המתמודדות עם פאנס ופאנדס.',
      canonicalPath: '/scales/cbi',
    },
  },
  {
    path: '/scales/cbi/form',
    component: <CBIScalePage />,
    seo: {
      title: 'מילוי שאלון CBI | פאנס/פאנדס ישראל',
      description:
        'עמוד מילוי שאלון CBI להערכת עומס משפחתי ועומס מטפל.',
      canonicalPath: '/scales/cbi/form',
    },
  },
  {
    path: '/scales/cbi/results',
    component: <CBIResultsPage />,
    seo: {
      title: 'תוצאות שאלון CBI | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות שאלון CBI.',
      canonicalPath: '/scales/cbi/results',
      noIndex: true,
    },
  },

  // Surveys
  // Surveys
  {
    path: '/surveys',
    component: <ProfessionalSurveysPage />,
    seo: {
      title: 'סקרים ושאלונים | פאנס/פאנדס ישראל',
      description:
        'סקרים, שאלונים וכלים לאיסוף מידע בנושא פאנס ופאנדס, משפחות, ילדים ואנשי מקצוע בישראל.',
      canonicalPath: '/surveys',
    },
  },
  {
    path: '/surveys/state-of-children',
    component: <SOCSurveyPage />,
    seo: {
      title: 'סקר מצב הילדים | פאנס/פאנדס ישראל',
      description:
        'סקר קהילתי בנושא מצבם של ילדים ומשפחות המתמודדים עם פאנס ופאנדס בישראל.',
      canonicalPath: '/surveys/state-of-children',
    },
  },
  {
    path: '/surveys/state-of-children/results',
    component: <SOCResultsPage />,
    seo: {
      title: 'תוצאות סקר מצב הילדים | פאנס/פאנדס ישראל',
      description: 'עמוד תוצאות פנימי של סקר מצב הילדים.',
      canonicalPath: '/surveys/state-of-children/results',
      noIndex: true,
    },
  },

  {
    path: '/holistic',
    component: <HolisticPage />,
    seo: {
      title: 'גישה הוליסטית ותמיכה משלימה | פאנס/פאנדס ישראל',
      description:
        'מידע על תמיכה משלימה, התמודדות יומיומית והיבטים רחבים של ליווי משפחות וילדים המתמודדים עם פאנס ופאנדס.',
      canonicalPath: '/holistic',
    },
  },
  {
    path: '/info/overview-professional',
    component: <InfoPage />,
    seo: {
      title: 'סקירה מקצועית על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'סקירה מקצועית על פאנס ופאנדס עבור אנשי חינוך, אנשי טיפול ואנשי מקצוע המעוניינים להבין את התמונה הקלינית והמשפחתית.',
      canonicalPath: '/info/overview-professional',
    },
  },
  {
    path: '/resources/videos',
    component: <VideosPage />,
    seo: {
      title: 'סרטונים והרצאות | פאנס/פאנדס ישראל',
      description:
        'סרטונים, הרצאות ותכנים מצולמים בנושא פאנס ופאנדס עבור הורים, משפחות, אנשי חינוך ואנשי מקצוע.',
      canonicalPath: '/resources/videos',
    },
  },

  // Professional pages
  {
    path: '/professional/diagnosis',
    component: <DiagnosisPage />,
    seo: {
      title: 'אבחון מקצועי של פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע מקצועי על אבחון פאנס ופאנדס, סימנים קליניים, תהליך הערכה והפניה לגורמים רפואיים מתאימים.',
      canonicalPath: '/professional/diagnosis',
    },
  },
  {
    path: '/professional/education',
    component: <EducationPage />,
    seo: {
      title: 'מידע לאנשי חינוך | פאנס/פאנדס ישראל',
      description:
        'מידע לאנשי חינוך על התמודדות עם תלמידים עם פאנס ופאנדס, התאמות, תמיכה בבית הספר וזיהוי שינויים פתאומיים.',
      canonicalPath: '/professional/education',
    },
  },
  {
    path: '/professional/articles',
    component: <ArticlesPage />,
    seo: {
      title: 'מאמרים מקצועיים על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מאמרים מקצועיים, סקירות וחומרי קריאה בנושא פאנס ופאנדס עבור אנשי מקצוע, הורים ואנשי חינוך.',
      canonicalPath: '/professional/articles',
    },
  },
  {
    path: '/professional/international',
    component: <InternationalPage />,
    seo: {
      title: 'מידע בינלאומי על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מקורות מידע בינלאומיים, קישורים וארגונים העוסקים בפאנס ופאנדס, מחקר, אבחון וטיפול.',
      canonicalPath: '/professional/international',
    },
  },
  {
    path: '/professional/research',
    component: <ResearchPage />,
    seo: {
      title: 'מחקרים על פאנס ופאנדס | פאנס/פאנדס ישראל',
      description:
        'מידע מחקרי ומקורות מדעיים על פאנס ופאנדס, הקשר למערכת החיסון, זיהומים ותסמינים נוירופסיכיאטריים.',
      canonicalPath: '/professional/research',
    },
  },
  {
    path: '/professional/surveys',
    component: <ProfessionalSurveysPage />,
    seo: {
      title: 'סקרים ושאלונים | פאנס/פאנדס ישראל',
      description:
        'סקרים ושאלונים בנושא פאנס ופאנדס, מצב הילדים, משפחות, אנשי מקצוע והעלאת מודעות בישראל.',
      canonicalPath: '/professional/surveys',
    },
  },


  {
    path: '/community/articles',
    component: <BlogListPage />,
    seo: {
      title: 'מאמרי קהילה | פאנס/פאנדס ישראל',
      description:
        'מאמרים, סיפורים ותכנים מהקהילה בנושא פאנס ופאנדס, הורים, משפחות, חינוך ותמיכה.',
      canonicalPath: '/community/articles',
    },
  },
  {
    path: '/community/articles/:id',
    component: <BlogArticlePage />,
    seo: {
      title: 'מאמר קהילה | פאנס/פאנדס ישראל',
      description:
        'מאמר קהילה בנושא פאנס ופאנדס, התמודדות משפחתית, תמיכה, חינוך והעלאת מודעות.',
      canonicalPath: '/community/articles',
    },
  },

  // ── Admin routes (no nav links to these anywhere in the app) ──────────────
  {
    path: '/admin/login',
    component: <AdminLoginPage />,
    seo: {
      title: 'כניסת מנהל | פאנס/פאנדס ישראל',
      description: 'עמוד כניסה למנהלי האתר.',
      canonicalPath: '/admin/login',
      noIndex: true,
    },
  },
  {
    path: '/admin/surveys/state-of-children',
    component: (
      <ProtectedRoute>
        <SOCAdminPage />
      </ProtectedRoute>
    ),
    seo: {
      title: 'ניהול סקר מצב הילדים | פאנס/פאנדס ישראל',
      description: 'עמוד ניהול פנימי לסקר מצב הילדים.',
      canonicalPath: '/admin/surveys/state-of-children',
      noIndex: true,
    },
  },
  {
    path: '/professional/articles/admin/pdf',
    component: (
      <ProtectedRoute>
        <PdfAdminPage />
      </ProtectedRoute>
    ),
    seo: {
      title: 'ניהול קבצי PDF | פאנס/פאנדס ישראל',
      description: 'עמוד ניהול פנימי לקבצי PDF.',
      canonicalPath: '/professional/articles/admin/pdf',
      noIndex: true,
    },
  },
  {
    path: '/resources/media-coverage',
    component: <MediaCoveragePage />,
    seo: {
      title: 'פאנס ופאנדס בתקשורת | פאנס/פאנדס ישראל',
      description:
        'כתבות, פרסומים ואזכורים בתקשורת בנושא פאנס ופאנדס והעלאת מודעות ציבורית בישראל.',
      canonicalPath: '/resources/media-coverage',
    },
  },
  {
    path: '/admin/media-articles',
    component: (
      <ProtectedRoute>
        <MediaArticlesAdmin />
      </ProtectedRoute>
    ),
    seo: {
      title: 'ניהול כתבות תקשורת | פאנס/פאנדס ישראל',
      description: 'עמוד ניהול פנימי לכתבות ואזכורים בתקשורת.',
      canonicalPath: '/admin/media-articles',
      noIndex: true,
    },
  },
];

export default AppRoutes;
