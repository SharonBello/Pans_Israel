import React from 'react';

import HomePage from './pages/HomePage/HomePage.tsx';
import SymptomsPage from './pages/SymptomsPage/SymptomsPage.tsx';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage.tsx';
import TestimonialsPage from './pages/TestimonialsPage/TestimonialsPage.tsx';
import ProfessionalsHelpPage from './pages/MedicalHelpPage/ProfessionalsHelpPage.tsx';
import PandasScalePage from './pages/SymptomsPage/scales/PANDASScale/PandasScalePage/PandasScalePage.tsx';
import PandasScaleResultsPage from './pages/SymptomsPage/scales/PANDASScale/PandasScaleResultsPage/PandasScaleResultsPage.tsx';
import PandasScaleHomePage from './pages/SymptomsPage/scales/PANDASScale/PandasScaleHomePage/PandasScaleHomePage.tsx';

type AppRoute = {
  path: string;
  component: React.ReactElement;
};

const AppRoutes: AppRoute[] = [
  {
    path: '/',
    component: <HomePage />,
  },
  {
    path: '/symptoms',
    component: <SymptomsPage />,
  },
  {
    path: '/Professionals-help',
    component: <ProfessionalsHelpPage />,
  },
  {
    path: '/resources',
    component: <ResourcesPage />,
  },
  {
    path: '/testimonials',
    component: <TestimonialsPage />,
  },
  {
    path: '/scales/pandas',
    component: <PandasScaleHomePage />,
  },
  {
    path: '/scales/pandas/scales-page',
    component: <PandasScalePage />,
  },
  {
    path: '/scales/pandas/results',
    component: <PandasScaleResultsPage />,
  },
];

export default AppRoutes;
