import { Timestamp } from 'firebase/firestore';

// --------------------------------------------------------------------------
// Question Types
// --------------------------------------------------------------------------

export type QuestionType =
    | 'single_choice'      // Radio buttons - one answer
    | 'multiple_choice'    // Checkboxes - multiple answers
    | 'scale'              // Linear scale (1-5, 1-10, etc.)
    | 'yes_no'             // Yes/No toggle
    | 'text'               // Free text input
    | 'number'             // Numeric input
    | 'date'               // Date picker
    | 'email';             // Email input (for initial registration)

// --------------------------------------------------------------------------
// Base Question Interface
// --------------------------------------------------------------------------

export interface BaseQuestionOption {
    id: string;
    label: string;
    value: string | number;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    questionText: string;
    questionSubtext?: string;
    required: boolean;
    options?: BaseQuestionOption[];
    // Scale-specific
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
    // Validation
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    // Conditional logic
    dependsOn?: {
        questionId: string;
        values: (string | number | boolean)[];
    };
}

// --------------------------------------------------------------------------
// Survey Category (for grouping questions)
// --------------------------------------------------------------------------

export interface BaseSurveyCategory {
    id: string;
    title: string;
    description?: string;
    questions: BaseQuestion[];
}

// --------------------------------------------------------------------------
// Survey Definition
// --------------------------------------------------------------------------

export interface BaseSurveyDefinition {
    id: string;
    slug: string;                    // URL-friendly name
    title: string;
    description: string;
    version: string;
    isActive: boolean;
    categories: BaseSurveyCategory[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

// --------------------------------------------------------------------------
// Survey Serial (Email → Serial mapping)
// --------------------------------------------------------------------------

export interface SurveySerial {
    email: string;
    serial: string;                  // e.g., "IL-2025-00001"
    createdAt: Timestamp;
    responseCount: number;           // How many surveys this email submitted
}

// --------------------------------------------------------------------------
// Survey Response
// --------------------------------------------------------------------------

export interface BaseSurveyResponse {
    id?: string;
    surveyId: string;
    serial: string;                  // Reference to SurveySerial
    childIndex: number;              // 1, 2, 3... for families with multiple children
    submittedAt: Timestamp;
    answers: Record<string, string | number | boolean | string[]>;
}

// --------------------------------------------------------------------------
// Survey Statistics (for results page)
// --------------------------------------------------------------------------

export interface SurveyStatistics {
    totalResponses: number;
    uniqueFamilies: number;
    lastResponseAt?: Timestamp;
    questionStats: Record<string, QuestionStatistics>;
}

export interface QuestionStatistics {
    questionId: string;
    totalAnswers: number;
    // For choice questions
    optionCounts?: Record<string, number>;
    optionPercentages?: Record<string, number>;
    // For scale questions
    average?: number;
    median?: number;
    distribution?: Record<number, number>;
    // For text questions
    sampleAnswers?: string[];
}

// --------------------------------------------------------------------------
// Survey State (for form management)
// --------------------------------------------------------------------------

export interface SurveyFormState {
    currentCategoryIndex: number;
    currentQuestionIndex: number;
    answers: Record<string, string | number | boolean | string[]>;
    isSubmitting: boolean;
    isComplete: boolean;
    errors: Record<string, string>;
}

// --------------------------------------------------------------------------
// Export Formats
// --------------------------------------------------------------------------

export type ExportFormat = 'csv' | 'xlsx' | 'json';

export interface ExportOptions {
    format: ExportFormat;
    includeTimestamp: boolean;
    anonymize: boolean;              // Remove serial numbers
    dateRange?: {
        start: Date;
        end: Date;
    };
}
