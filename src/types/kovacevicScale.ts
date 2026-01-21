// ============================================================================
// Kovacevic Diagnostic Scale Types
// Based on Dr. Kovacevic's 2019 diagnostic criteria
// ============================================================================

/**
 * Rating values for symptom presence
 */
export type SymptomPresence = 'yes' | 'no' | 'unknown';

/**
 * Mandatory Criterion - Sudden Onset
 * Required for Formula 1 diagnosis
 */
export interface MandatoryCriterion {
    /** Sudden development of symptoms from healthy state within hours (rarely 1-2 days) */
    suddenOnset: boolean;
    /** Parents can recall exact day/hour when symptoms appeared */
    canRecallExactOnset: boolean;
    /** Dynamic evolution of symptoms over 2-6 weeks */
    dynamicEvolution: boolean;
}

/**
 * Core Criteria - Main symptoms
 */
export interface CoreCriteria {
    /** At least one OCD symptom - observed in 100% of patients */
    ocdSymptoms: boolean;
    /** Separation anxiety - observed in nearly 100% of patients */
    separationAnxiety: boolean;
    /** Tics and/or involuntary movements - observed in 79% of patients */
    ticsOrMovements: boolean;
    /** Anorexia/eating disorder with >5% weight loss - observed in 17% of patients */
    eatingDisorder: boolean;
}

/**
 * Secondary Criteria - Group 1
 */
export interface SecondaryCriteriaGroup1 {
    /** Sleep disturbances: insomnia, nightmares, refusal to sleep alone */
    sleepDisturbances: boolean;
    /** Mydriasis: dilated pupils, especially in acute phase */
    mydriasis: boolean;
    /** Behavioral regression: baby talk, tantrums, age-inappropriate behavior */
    behavioralRegression: boolean;
    /** Frightened appearance or doll-like mannerisms */
    frightenedAppearance: boolean;
    /** Aggression toward others and/or suicidal behavior */
    aggressionOrSuicidal: boolean;
}

/**
 * Secondary Criteria - Group 2
 */
export interface SecondaryCriteriaGroup2 {
    /** Fine motor skills impairment */
    fineMotorImpairment: boolean;
    /** Hyperactivity, lack of concentration, inattention (ADD/ADHD-like) */
    hyperactivityAttention: boolean;
    /** Short-term memory loss */
    memoryLoss: boolean;
    /** Learning disabilities, especially in math (new onset) */
    learningDisabilities: boolean;
    /** Urinary symptoms: frequency, enuresis, daytime incontinence */
    urinarySymptoms: boolean;
    /** Hallucinations */
    hallucinations: boolean;
    /** Sensory hypersensitivity: smells, sounds, light, touch */
    sensoryHypersensitivity: boolean;
    /** Emotional lability / depression */
    emotionalLability: boolean;
    /** Dysgraphia: difficulty with handwriting */
    dysgraphia: boolean;
    /** Selective mutism */
    selectiveMutism: boolean;
    /** Hypotonia: reduced muscle tone */
    hypotonia: boolean;
    /** Intermittent dystonia: muscle contractions */
    dystonia: boolean;
    /** Non-specific abdominal complaints */
    abdominalComplaints: boolean;
}

/**
 * Treatment Response (10% of diagnosis)
 */
export interface TreatmentResponse {
    /** Positive response to antibiotics */
    antibioticsResponse: SymptomPresence;
    /** Positive response to high-dose steroids */
    steroidsResponse: SymptomPresence;
}

/**
 * Lab Results (5% of diagnosis)
 */
export interface LabResults {
    /** Overall lab results status */
    status: 'positive' | 'negative' | 'inconclusive' | 'not_tested';
    /** Notes about specific findings (optional, anonymous) */
    notes?: string;
}

/**
 * Complete Kovacevic Form Data
 */
export interface KovacevicFormData {
    mandatory: MandatoryCriterion;
    core: CoreCriteria;
    secondaryGroup1: SecondaryCriteriaGroup1;
    secondaryGroup2: SecondaryCriteriaGroup2;
    treatment: TreatmentResponse;
    labs: LabResults;
}

/**
 * Diagnosis Result
 */
export type DiagnosisFormula = 'formula1' | 'formula2' | 'not_met' | 'partial';

export interface KovacevicDiagnosisResult {
    /** Which formula was met, if any */
    formula: DiagnosisFormula;
    /** Breakdown of criteria met */
    criteriaMetCount: {
        mandatory: number; // 0-3
        core: number; // 0-4
        secondaryGroup1: number; // 0-5
        secondaryGroup2: number; // 0-13
    };
    /** Treatment response factor (0-10%) */
    treatmentScore: number;
    /** Lab results factor (0-5%) */
    labScore: number;
    /** Confidence percentage (80% symptoms + 10% treatment + 5% labs + 5% margin) */
    confidenceBreakdown: {
        symptoms: number; // Up to 80%
        treatment: number; // Up to 10%
        labs: number; // Up to 5%
        margin: number; // 5% error margin
    };
}

/**
 * Hebrew labels for all criteria
 */
export const KOVACEVIC_LABELS = {
    mandatory: {
        title: 'קריטריון חובה',
        subtitle: 'נצפה ב-96.5% מהמטופלים',
        suddenOnset: 'התחלה פתאומית - התפתחות פתאומית ומואצת של תסמינים מתוך מצב בריאותי תקין, בפרק זמן של שעות (לעיתים נדירות 1-2 ימים)',
        canRecallExactOnset: 'ההורים יכולים להיזכר ביום המדויק או אפילו בשעה המדויקת שבה הופיעו התסמינים',
        dynamicEvolution: 'אבולוציה דינמית אופיינית של תסמינים (במונחי אופי ועוצמה) במהלך תקופה של 2-6 שבועות',
    },
    core: {
        title: 'קריטריונים מרכזיים',
        ocdSymptoms: 'נוכחות של תסמיני OCD (לפחות תסמין אחד) - נצפה ב-100% מהמטופלים',
        separationAnxiety: 'חרדת פרידה - נצפתה כמעט בכל המטופלים',
        ticsOrMovements: 'טיקים ו/או תנועות בלתי רצוניות - נצפו ב-79% מהמטופלים',
        eatingDisorder: 'אנורקסיה/הפרעת אכילה עם ירידה של מעל 5% ממשקל הגוף - נצפתה ב-17% מהמטופלים',
    },
    secondaryGroup1: {
        title: 'קריטריונים משניים - קבוצה 1',
        sleepDisturbances: 'הפרעות שינה: נדודי שינה, סיוטי לילה, סירוב לישון לבד',
        mydriasis: 'מידריאזיס: אישונים מורחבים, במיוחד בשלב החריף',
        behavioralRegression: 'נסיגה התנהגותית: שפת תינוק, התקפי זעם, התנהגות לא תואמת גיל',
        frightenedAppearance: 'מראה מבוהל או מנייריזם דמוי בובה',
        aggressionOrSuicidal: 'תוקפנות כלפי אחרים ו/או התנהגות אובדנית',
    },
    secondaryGroup2: {
        title: 'קריטריונים משניים - קבוצה 2',
        fineMotorImpairment: 'פגיעה במיומנויות מוטוריות עדינות',
        hyperactivityAttention: 'היפראקטיביות, חוסר ריכוז וחוסר תשומת לב (דמוי ADD/ADHD)',
        memoryLoss: 'אובדן זיכרון לטווח קצר',
        learningDisabilities: 'לקויות למידה, בעיקר במתמטיקה (שלא היו קיימות לפני)',
        urinarySymptoms: 'תסמיני שתן: תכיפות, בריחת שתן, אי-שליטה ביום',
        hallucinations: 'הלוצינציות (הזיות)',
        sensoryHypersensitivity: 'רגישות יתר חושית: ריחות, קולות, אור, מגע',
        emotionalLability: 'תנודתיות רגשית / דיכאון',
        dysgraphia: 'דיסגרפיה: קושי בכתיבה ידנית',
        selectiveMutism: 'אילמות סלקטיבית',
        hypotonia: 'היפוטוניה: טונוס שרירים מופחת',
        dystonia: 'דיסטוניה לסירוגין: התכווצויות שרירים',
        abdominalComplaints: 'תלונות בטן לא ספציפיות',
    },
    treatment: {
        title: 'תגובה לטיפול',
        subtitle: '10% מהאבחנה',
        antibioticsResponse: 'תגובה חיובית לאנטיביוטיקה',
        steroidsResponse: 'תגובה חיובית לסטרואידים במינון גבוה',
    },
    labs: {
        title: 'ממצאים מעבדתיים',
        subtitle: '5% מהאבחנה (ממצאים שליליים אינם שוללים אבחנה)',
        positive: 'ממצאים חיוביים',
        negative: 'ממצאים שליליים',
        inconclusive: 'ממצאים לא חד-משמעיים',
        not_tested: 'לא נבדק',
    },
    diagnosis: {
        formula1: {
            title: 'נוסחה מס\' 1',
            description: 'הופעה פתאומית + קריטריון חובה + 2 קריטריונים מרכזיים',
        },
        formula2: {
            title: 'נוסחה מס\' 2',
            description: '2 קריטריונים מרכזיים + 3 קריטריונים משניים (לפחות אחד מכל קבוצה)',
        },
        not_met: {
            title: 'לא עומד בקריטריונים',
            description: 'הקריטריונים לאבחון לא התמלאו במלואם',
        },
        partial: {
            title: 'עומד באופן חלקי',
            description: 'חלק מהקריטריונים התמלאו - מומלץ להתייעץ עם מומחה',
        },
    },
} as const;

/**
 * Initial form state
 */
export const KOVACEVIC_INITIAL_STATE: KovacevicFormData = {
    mandatory: {
        suddenOnset: false,
        canRecallExactOnset: false,
        dynamicEvolution: false,
    },
    core: {
        ocdSymptoms: false,
        separationAnxiety: false,
        ticsOrMovements: false,
        eatingDisorder: false,
    },
    secondaryGroup1: {
        sleepDisturbances: false,
        mydriasis: false,
        behavioralRegression: false,
        frightenedAppearance: false,
        aggressionOrSuicidal: false,
    },
    secondaryGroup2: {
        fineMotorImpairment: false,
        hyperactivityAttention: false,
        memoryLoss: false,
        learningDisabilities: false,
        urinarySymptoms: false,
        hallucinations: false,
        sensoryHypersensitivity: false,
        emotionalLability: false,
        dysgraphia: false,
        selectiveMutism: false,
        hypotonia: false,
        dystonia: false,
        abdominalComplaints: false,
    },
    treatment: {
        antibioticsResponse: 'unknown',
        steroidsResponse: 'unknown',
    },
    labs: {
        status: 'not_tested',
    },
};
