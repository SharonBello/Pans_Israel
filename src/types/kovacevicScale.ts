// ============================================================================
// Kovacevic Diagnostic Scale Types
// Based on Dr. Kovacevic's 2019 diagnostic criteria
// ============================================================================

/**
 * Rating values for symptom presence
 */
export type SymptomPresence = 'yes' | 'no' | 'unknown';
export type CriterionResponse = 'yes' | 'no' | 'unknown';
export type SeverityRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface CriterionWithSeverity {
    present: CriterionResponse;
    severity: SeverityRating; // keep always present for simplicity
}
/**
 * Mandatory Criterion - Sudden Onset
 * Required for Formula 1 diagnosis
 */
export interface MandatoryCriterion {
    suddenOnset: CriterionResponse;
    canRecallExactOnset: CriterionResponse;
    dynamicEvolution: CriterionResponse;
}


/**
 * Core Criteria - Main symptoms
 */
export interface CoreCriteria {
    ocdSymptoms: CriterionWithSeverity;
    separationAnxiety: CriterionWithSeverity;
    ticsOrMovements: CriterionWithSeverity;
    eatingDisorder: CriterionWithSeverity;
}

export interface SecondaryCriteriaGroup1 {
    sleepDisturbances: CriterionWithSeverity;
    mydriasis: CriterionWithSeverity;
    behavioralRegression: CriterionWithSeverity;
    frightenedAppearance: CriterionWithSeverity;
    aggressionOrSuicidalBehavior: CriterionWithSeverity; // keep the name your utils expect
}

export interface SecondaryCriteriaGroup2 {
    fineMotorImpairment: CriterionWithSeverity;
    hyperactivityAttention: CriterionWithSeverity;
    memoryLoss: CriterionWithSeverity;
    learningDisabilities: CriterionWithSeverity;
    urinarySymptoms: CriterionWithSeverity;
    hallucinations: CriterionWithSeverity;
    sensoryHypersensitivity: CriterionWithSeverity;
    emotionalLabilityDepression: CriterionWithSeverity; // keep the name your utils expect
    dysgraphia: CriterionWithSeverity;
    selectiveMutism: CriterionWithSeverity;
    hypotonia: CriterionWithSeverity;
    intermittentDystonia: CriterionWithSeverity; // keep the name your utils expect
    abdominalComplaints: CriterionWithSeverity;
}

/**
 * Treatment Response (10% of diagnosis)
 */
export interface TreatmentResponse {
    antibioticsResponse: CriterionResponse;
    steroidsResponse: CriterionResponse;
}

export interface LabResults {
    overallResult: 'positive' | 'negative' | 'inconclusive' | 'not_tested';
    elevatedASO: CriterionResponse;
    positiveThroatCulture: CriterionResponse;
}

/**
 * Complete Kovacevic Form Data
 */
export interface KovacevicFormData {
    mandatory: MandatoryCriterion;
    core: CoreCriteria;
    secondaryGroup1: SecondaryCriteriaGroup1;
    secondaryGroup2: SecondaryCriteriaGroup2;
    additional: {
        treatmentResponse: TreatmentResponse;
        labResults: LabResults;
    };
}

/**
 * Diagnosis Result
 */
export type DiagnosisFormula = 'formula1' | 'formula2' | 'not_met' | 'partial' | 'inconclusive';

export interface KovacevicDiagnosisResult {
    formula: DiagnosisFormula;
    criteriaMet: {
        mandatory: boolean;
        coreCount: number;
        secondaryGroup1Count: number;
        secondaryGroup2Count: number;
        totalSecondary: number;
    };
    confidence: {
        clinicalSymptoms: number;
        treatmentResponse: number;
        labResults: number;
        margin: number;
        total: number;
    };
    summaryHebrew: string;
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
        aggressionOrSuicidalBehavior: 'תוקפנות כלפי אחרים ו/או התנהגות אובדנית',
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
        emotionalLabilityDepression: 'תנודתיות רגשית / דיכאון',
        dysgraphia: 'דיסגרפיה: קושי בכתיבה ידנית',
        selectiveMutism: 'אילמות סלקטיבית',
        hypotonia: 'היפוטוניה: טונוס שרירים מופחת',
        intermittentDystonia: 'דיסטוניה לסירוגין: התכווצויות שרירים',
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
    responses: {
        yes: 'כן',
        no: 'לא',
        unknown: 'לא יודע/ת',
    },
    severity: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
    },
} as const;

/**
 * Initial form state
 */
const C = (present: CriterionResponse = 'unknown', severity: SeverityRating = 0): CriterionWithSeverity => ({
    present,
    severity,
});

export const KOVACEVIC_INITIAL_STATE: KovacevicFormData = {
    mandatory: {
        suddenOnset: 'unknown',
        canRecallExactOnset: 'unknown',
        dynamicEvolution: 'unknown',
    },
    core: {
        ocdSymptoms: C(),
        separationAnxiety: C(),
        ticsOrMovements: C(),
        eatingDisorder: C(),
    },
    secondaryGroup1: {
        sleepDisturbances: C(),
        mydriasis: C(),
        behavioralRegression: C(),
        frightenedAppearance: C(),
        aggressionOrSuicidalBehavior: C(),
    },
    secondaryGroup2: {
        fineMotorImpairment: C(),
        hyperactivityAttention: C(),
        memoryLoss: C(),
        learningDisabilities: C(),
        urinarySymptoms: C(),
        hallucinations: C(),
        sensoryHypersensitivity: C(),
        emotionalLabilityDepression: C(),
        dysgraphia: C(),
        selectiveMutism: C(),
        hypotonia: C(),
        intermittentDystonia: C(),
        abdominalComplaints: C(),
    },
    additional: {
        treatmentResponse: {
            antibioticsResponse: 'unknown',
            steroidsResponse: 'unknown',
        },
        labResults: {
            overallResult: 'not_tested',
            elevatedASO: 'unknown',
            positiveThroatCulture: 'unknown',
        },
    },
};

