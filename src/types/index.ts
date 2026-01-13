// ==========================================================================
// PANS/PANDAS Israel - TypeScript Types & Interfaces
// ==========================================================================

// --------------------------------------------------------------------------
// Common Types
// --------------------------------------------------------------------------

export type Direction = 'rtl' | 'ltr';
export type Language = 'he' | 'en';
export type Theme = 'dark' | 'light';

// --------------------------------------------------------------------------
// Navigation Types
// --------------------------------------------------------------------------

export interface NavItem {
  id: string;
  label: string;
  labelHe: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  isExternal?: boolean;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  sideNav: NavItem[];
  footerNav: NavItem[];
}

// --------------------------------------------------------------------------
// Content Types
// --------------------------------------------------------------------------

export interface HeroContent {
  title: string;
  titleHe: string;
  subtitle: string;
  subtitleHe: string;
  ctaPrimary: {
    label: string;
    labelHe: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    labelHe: string;
    href: string;
  };
}

export interface SectionContent {
  id: string;
  title: string;
  titleHe: string;
  description?: string;
  descriptionHe?: string;
  icon?: string;
}

export interface CardContent {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  icon?: string;
  href?: string;
  image?: string;
}

// --------------------------------------------------------------------------
// FAQ Types
// --------------------------------------------------------------------------

export interface FAQItem {
  id: string;
  question: string;
  questionHe: string;
  answer: string;
  answerHe: string;
  category?: string;
}

// --------------------------------------------------------------------------
// Resource Types
// --------------------------------------------------------------------------

export interface Resource {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  type: 'article' | 'video' | 'pdf' | 'link' | 'form';
  url: string;
  category: string;
  isExternal?: boolean;
  date?: string;
}

// --------------------------------------------------------------------------
// Contact Types
// --------------------------------------------------------------------------

export interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  addressHe?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'whatsapp';
  url: string;
  label?: string;
}

// --------------------------------------------------------------------------
// Story/Testimonial Types
// --------------------------------------------------------------------------

export interface Story {
  id: string;
  title: string;
  titleHe: string;
  content: string;
  contentHe: string;
  author?: string;
  authorHe?: string;
  date?: string;
  isAnonymous?: boolean;
  category?: 'diagnosis' | 'treatment' | 'recovery' | 'support';
}

// --------------------------------------------------------------------------
// Event Types
// --------------------------------------------------------------------------

export interface Event {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  date: string;
  time?: string;
  location?: string;
  locationHe?: string;
  isOnline?: boolean;
  registrationUrl?: string;
  image?: string;
}

// --------------------------------------------------------------------------
// Professional/Expert Types
// --------------------------------------------------------------------------

export interface Professional {
  id: string;
  name: string;
  nameHe: string;
  title: string;
  titleHe: string;
  specialty?: string;
  specialtyHe?: string;
  location?: string;
  locationHe?: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
}

// --------------------------------------------------------------------------
// Survey/Form Types (for Firebase)
// --------------------------------------------------------------------------

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  responses: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  isAnonymous: boolean;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating' | 'date';
  question: string;
  questionHe: string;
  required: boolean;
  options?: {
    value: string;
    label: string;
    labelHe: string;
  }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// --------------------------------------------------------------------------
// Analytics Types
// --------------------------------------------------------------------------

export interface VisitorCount {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastUpdated: Date;
}

export interface PageView {
  path: string;
  timestamp: Date;
  sessionId?: string;
}

// --------------------------------------------------------------------------
// Component Props Types
// --------------------------------------------------------------------------

export interface BaseProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithOptionalChildren {
  children?: React.ReactNode;
}

// --------------------------------------------------------------------------
// State Types
// --------------------------------------------------------------------------

export interface AppState {
  language: Language;
  direction: Direction;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null;
}

// --------------------------------------------------------------------------
// API Response Types
// --------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
