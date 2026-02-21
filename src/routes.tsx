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

// ── Surveys ──────────────────────────────────────────────────────────────────
// /surveys → original surveys page (no hero/tabs)
// import SurveysPage from './pages/ProfessionalPages/SurveysPage/SurveysPage.tsx';
// /professional/surveys → new page with ProfHero + ProfessionalTabs
import ProfessionalSurveysPage from './pages/ProfessionalPages/ProfessionalSurveysPage/ProfessionalSurveysPage.tsx';

import InfoPage from './pages/InfoPage/InfoPage.tsx';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage.tsx';
import ResourcesDetailPage from './pages/ResourcesPage/ResourcesDetailPage/ResourcesDetailPage.tsx';
import SupportPage from './pages/SupportPage/SupportPage.tsx';
import HolisticPage from './pages/HolisticPage/HolisticPage.tsx';
import VideosPage from './pages/VideosPage/VideosPage.tsx';

// ── Professional pages (fix: default imports, not named {}) ──────────────────
import DiagnosisPage from './pages/ProfessionalPages/DiagnosisPage/DiagnosisPage.tsx';
import EducationPage from './pages/ProfessionalPages/EducationPage/EducationPage.tsx';
import ArticlesPage from './pages/ProfessionalPages/ArticlesPage/ArticlesPage.tsx';
import InternationalPage from './pages/ProfessionalPages/InternationalPage/InternationalPage.tsx';
import ResearchPage from './pages/ProfessionalPages/ResearchPage/ResearchPage.tsx';

type AppRoute = {
  path: string;
  component: React.ReactElement;
};

const AppRoutes: AppRoute[] = [
  { path: '/', component: <HomePage /> },
  { path: '/about', component: <AboutPage /> },
  { path: '/info', component: <InfoPage /> },
  { path: '/info/scales', component: <InfoPage /> },
  { path: '/info/:pageId', component: <InfoPage /> },
  { path: '/symptoms', component: <SymptomsPage /> },
  { path: '/Professionals-help', component: <ProfessionalsHelpPage /> },
  { path: '/resources', component: <ResourcesPage /> },
  { path: '/resources/:pageId', component: <ResourcesDetailPage /> },
  { path: '/support', component: <SupportPage /> },
  { path: '/testimonials', component: <TestimonialsPage /> },

  // Scales
  { path: '/scales/pandas', component: <PandasScaleHomePage /> },
  { path: '/scales/pandas/scales-page', component: <PandasScalePage /> },
  { path: '/scales/pandas/results', component: <PandasScaleResultsPage /> },
  { path: '/scales/kovacevic', component: <KovacevicHomePage /> },
  { path: '/scales/kovacevic/form', component: <KovacevicScalePage /> },
  { path: '/scales/kovacevic/results', component: <KovacevicResultsPage /> },
  { path: '/scales/ptec', component: <PTECHomePage /> },
  { path: '/scales/ptec/form', component: <PTECScalePage /> },
  { path: '/scales/ptec/results', component: <PTECResultsPage /> },
  { path: '/scales/pans31', component: <PANS31HomePage /> },
  { path: '/scales/pans31/form', component: <PANS31ScalePage /> },
  { path: '/scales/pans31/results', component: <PANS31ResultsPage /> },
  { path: '/scales/cbi', component: <CBIHomePage /> },
  { path: '/scales/cbi/form', component: <CBIScalePage /> },
  { path: '/scales/cbi/results', component: <CBIResultsPage /> },

  // Surveys — /surveys uses OLD page, /professional/surveys uses NEW page
  { path: '/surveys', component: <ProfessionalSurveysPage /> },
  { path: '/surveys/state-of-children', component: <SOCSurveyPage /> },
  { path: '/surveys/state-of-children/results', component: <SOCResultsPage /> },
  { path: '/admin/surveys/state-of-children', component: <SOCAdminPage /> },

  { path: '/holistic', component: <HolisticPage /> },
  { path: '/info/overview-professional', component: <InfoPage /> },
  { path: '/resources/videos', component: <VideosPage /> },

  // Professional pages
  { path: '/professional/diagnosis', component: <DiagnosisPage /> },
  { path: '/professional/education', component: <EducationPage /> },
  { path: '/professional/articles', component: <ArticlesPage /> },
  { path: '/professional/international', component: <InternationalPage /> },
  { path: '/professional/research', component: <ResearchPage /> },
  { path: '/professional/surveys', component: <ProfessionalSurveysPage /> },
];

export default AppRoutes;