import React from 'react';

import HomePage from './pages/HomePage/HomePage.tsx';
import SymptomsPage from './pages/SymptomsPage/SymptomsPage.tsx';
import MedicalHelpPage from './pages/MedicalHelpPage/MedicalHelpPage.tsx';
import ResourcesPage from './pages/ResourcesPage/ResourcesPage.tsx';
import TestimonialsPage from './pages/TestimonialsPage/TestimonialsPage.tsx';

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
    path: '/medical-help',
    component: <MedicalHelpPage />,
  },
  {
    path: '/resources',
    component: <ResourcesPage />,
  },
  {
    path: '/testimonials',
    component: <TestimonialsPage />,
  },
];

export default AppRoutes;
