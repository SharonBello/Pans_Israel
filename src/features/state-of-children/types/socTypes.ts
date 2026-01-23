// ==========================================================================
// SOC (State of Children) Survey Types - 2025
// ==========================================================================

import type {
    BaseQuestion,
    BaseSurveyCategory,
    BaseSurveyDefinition,
    BaseSurveyResponse,
    SurveyStatistics,
} from '../../shared/types/baseSurveyTypes';

// --------------------------------------------------------------------------
// Survey Constants
// --------------------------------------------------------------------------

export const SOC_SURVEY_ID = 'state_of_children_2025';
export const SOC_SURVEY_SLUG = 'state-of-children';
export const SOC_SURVEY_VERSION = '1.0.0';

// --------------------------------------------------------------------------
// SOC Question Categories
// --------------------------------------------------------------------------

export type SOCCategoryId =
    | 'registration'           // Email registration (separate step)
    | 'basic_profile'          // Child profile (age, gender, onset)
    | 'infection_triggers'     // What caused the onset
    | 'symptoms'               // All PANS/PANDAS symptoms
    | 'illness_course'         // Severity, school impact
    | 'diagnosis'              // Who diagnosed, how many doctors
    | 'treatments'             // What treatments, effectiveness
    | 'comorbid_conditions'    // Other health conditions
    | 'family_impact'          // Financial, emotional
    | 'family_history'         // Parent history
    | 'current_status';        // Current state of child

// --------------------------------------------------------------------------
// SOC-Specific Question (extends Base)
// --------------------------------------------------------------------------

export interface SOCQuestion extends BaseQuestion {
    category: SOCCategoryId;
    ppnEquivalent?: string;    // Reference to original PPN question number
}

// --------------------------------------------------------------------------
// SOC Category
// --------------------------------------------------------------------------

export interface SOCCategory extends BaseSurveyCategory {
    id: SOCCategoryId;
    questions: SOCQuestion[];
    icon?: string;
}

// --------------------------------------------------------------------------
// SOC Survey Definition
// --------------------------------------------------------------------------

export interface SOCSurveyDefinition extends BaseSurveyDefinition {
    id: typeof SOC_SURVEY_ID;
    categories: SOCCategory[];
}

// --------------------------------------------------------------------------
// SOC Response
// --------------------------------------------------------------------------

// export interface SOCResponse extends BaseSurveyResponse {
//     surveyId: typeof SOC_SURVEY_ID;
//     answers: SOCAnswers;
// }

// --------------------------------------------------------------------------
// SOC Answers (typed for each question)
// --------------------------------------------------------------------------

export interface SOCAnswers {
    // Basic Profile
    child_gender?: 'male' | 'female' | 'other';
    child_current_age?: number;
    child_onset_age?: number;
    had_symptoms_before_onset?: boolean;
    symptoms_before_onset_age?: number;

    // Infection Triggers
    primary_trigger?: string;
    trigger_infections?: string[];
    had_strep_confirmed?: boolean;

    // Symptoms (each rated by presence/severity)
    symptom_ocd?: number;
    symptom_anxiety?: number;
    symptom_mood_swings?: number;
    symptom_irritability?: number;
    symptom_aggression?: number;
    symptom_depression?: number;
    symptom_tics_motor?: number;
    symptom_tics_vocal?: number;
    symptom_sensory_sensitivity?: number;
    symptom_sleep_issues?: number;
    symptom_eating_issues?: number;
    symptom_urinary_issues?: number;
    symptom_cognitive_decline?: number;
    symptom_handwriting_decline?: number;
    symptom_separation_anxiety?: number;
    symptom_hallucinations?: number;
    symptom_regression?: number;
    symptoms_other?: string;

    // Illness Course
    unable_to_attend_school?: boolean;
    school_absence_duration?: string;
    life_impact_severity?: number;
    flare_count?: number;
    typical_flare_duration?: string;

    // Diagnosis
    diagnosed_by?: string;
    doctors_visited_count?: string;
    diagnosis_method?: string[];
    time_to_diagnosis?: string;
    misdiagnoses?: string[];

    // Treatments
    treatments_used?: string[];
    treatment_antibiotics_helpful?: number;
    treatment_steroids_helpful?: number;
    treatment_ivig_helpful?: number;
    treatment_plasmapheresis_helpful?: number;
    treatment_psychiatric_helpful?: number;
    treatment_cbt_helpful?: number;
    treatment_other?: string;
    treatment_other_helpful?: number;

    // Comorbid Conditions
    has_comorbid_conditions?: boolean;
    comorbid_conditions?: string[];
    has_allergies?: boolean;
    allergy_types?: string[];

    // Family Impact
    medical_professional_support?: number;
    financial_impact?: string;
    total_spent_estimate?: string;
    marriage_impact?: number;
    sibling_impact?: number;
    work_impact?: string;

    // Family History
    parent_history_anxiety?: boolean;
    parent_history_ocd?: boolean;
    parent_history_autoimmune?: boolean;
    parent_history_other?: string;
    family_autoimmune_conditions?: string[];

    // Current Status
    current_symptom_level?: number;
    symptoms_remitted?: boolean;
    remission_duration?: string;
    current_treatments?: string[];
    outlook_rating?: number;

    // Open-ended
    advice_for_new_parents?: string;
    additional_comments?: string;

    // Allow for additional dynamic fields
    [key: string]: string | number | boolean | string[] | undefined;
}

// --------------------------------------------------------------------------
// SOC Statistics (extends base with SOC-specific aggregations)
// --------------------------------------------------------------------------

export interface SOCStatistics extends SurveyStatistics {
    // Demographics
    genderDistribution: {
        male: number;
        female: number;
        other: number;
    };
    averageOnsetAge: number;
    averageCurrentAge: number;

    // Triggers
    triggerDistribution: Record<string, number>;

    // Symptoms (average severity)
    symptomAverages: Record<string, number>;
    topSymptoms: Array<{ symptom: string; percentage: number }>;

    // Treatments
    treatmentUsage: Record<string, number>;
    treatmentEffectiveness: Record<string, number>;

    // Outcomes
    remissionRate: number;
    averageSymptomLevel: number;
}

// --------------------------------------------------------------------------
// Chart Data Types (for visualization)
// --------------------------------------------------------------------------

export interface SOCChartData {
    pieCharts: {
        gender: Array<{ name: string; value: number; color: string }>;
        triggers: Array<{ name: string; value: number; color: string }>;
        diagnosis: Array<{ name: string; value: number; color: string }>;
    };
    barCharts: {
        symptoms: Array<{ name: string; value: number }>;
        treatments: Array<{ name: string; used: number; helpful: number }>;
        ageDistribution: Array<{ range: string; count: number }>;
    };
    gauges: {
        remissionRate: number;
        averageOutlook: number;
        medicalSupportRating: number;
    };
}
