// Types for Information Section

export interface InfoSection {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  description: string;
  content: InfoContent[];
  relatedPages?: RelatedPage[];
  assessmentScales?: AssessmentScale[];
}

export interface InfoContent {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'callout' | 'accordion' | 'table' | 'video' | 'download' | 'card' | 'image';
  title?: string;
  content?: string;
  items?: string[] | ListItem[];
  variant?: 'info' | 'warning' | 'success' | 'tip';
  videoUrl?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  columns?: string[];
  rows?: string[][];
  url?: string;
  imageUrl?: string;
}

export interface ListItem {
  title: string;
  description: string;
  url?: string;
}

export interface RelatedPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
}


export interface AssessmentScale {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  type: 'external' | 'interactive';
  externalUrl?: string;
  questions?: AssessmentQuestion[];
  maxScore?: number;
  interpretation?: ScoreInterpretation[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  questionHe: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  value: number;
  label: string;
  labelHe: string;
}

export interface ScoreInterpretation {
  minScore: number;
  maxScore: number;
  label: string;
  labelHe: string;
  description: string;
  descriptionHe: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'extreme';
}

export interface InfoNavItem {
  id: string;
  title: string;
  slug: string;
  icon: React.ReactNode;
  subItems?: InfoNavItem[];
}

export type InfoPageId = 'overview' | 'symptoms' | 'diagnosis' | 'treatment' | 'stories';
