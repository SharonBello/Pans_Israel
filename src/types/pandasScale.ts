export interface PansFormData {
    ocdSymptoms: SymptomGroup[];
    associatedSymptoms: SubSymptom[];
    functionalImpairment: SymptomGroup[];
}

export interface SymptomGroup {
    id: string;
    label: string;
    ratingBefore: RatingValue;
    ratingAfter: RatingValue;
    ratingCurrent: RatingValue;
}

export interface SubSymptom {
    id: string;
    domain: NPDomainKey;
    sublabel: string;
    ratingBefore: RatingValue;
    ratingAfter: RatingValue;
    ratingCurrent: RatingValue;
}

/** Time period for ratings */
export type TimePeriod = 'before' | 'after' | 'current';

/** Results by time period */
export interface TimeBasedScores {
    before: {
        ocd: number;
        np: number;
        functional: number;
        total: number;
    };
    after: {
        ocd: number;
        np: number;
        functional: number;
        total: number;
    };
    current: {
        ocd: number;
        np: number;
        functional: number;
        total: number;
    };
}

/** הערכים המותרים לכל דירוג (0–5) */
export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5;

/** כל אחד מה־11 התחומים הראשיים */
export type NPDomainKey =
  | 'anxiety'
  | 'moodiness'
  | 'irritability'
  | 'cognitive'
  | 'regression'
  | 'sensory'
  | 'hallucinations'
  | 'motor'
  | 'urinary'
  | 'sleep'
  | 'pupil';
  
export const NP_DOMAIN_LABELS: Record<NPDomainKey, string> = {
  anxiety: '1. תסמיני חרדה (0–5)',
  moodiness: '2. מצבי רוח קיצוניים ו/או דיכאון (0–5)',
  irritability: '3. רגזנות או התנהגות תוקפנית (0–5)',
  cognitive: '4. תסמינים קוגניטיביים/למידה, בלבול (0–5)',
  regression: '5. נסיגה התנהגותית (0–5)',
  sensory: '6.א. תסמינים חושיים (סנסוריים) (0–5)',
  hallucinations: '6.ב. הזיות (0–5)',
  motor: '6.ג. תסמינים מוטוריים (0–5)',
  urinary: '7.א. תסמיני שתן (0–5)',
  sleep: '7.ב. הפרעות שינה, עייפות (0–5)',
  pupil: '7.ג. אישונים מורחבים (0–5)',
};

/** מבנה הנתונים המלא של הטופס, כולל OCD, Associated NP (כעת SubSymptom[]), ו־Functional */
export interface PansFormData {
  ocdSymptoms: SymptomGroup[];
  associatedSymptoms: SubSymptom[];
  functionalImpairment: SymptomGroup[];
}

/** טיפוס שמייצג סימפטום רגיל (משמש ב–OCD וגם ב-Functional) */
export interface SymptomGroup {
  id: string;
  label: string;
  ratingBefore: RatingValue;
  ratingAfter: RatingValue;
  ratingCurrent: RatingValue;
}

/** טיפוס שמייצג תת־סימפטום מסוג NP (כולל תחום domain) */
export interface SubSymptom {
  id: string;
  domain: NPDomainKey;
  sublabel: string;
  ratingBefore: RatingValue;
  ratingAfter: RatingValue;
  ratingCurrent: RatingValue;
}

/** איחוד של SymptomGroup ו-SubSymptom, לשימוש ב־SurveySection */
export type SurveyItem = SymptomGroup | SubSymptom;

/** (אופציונלי) להוספת PansScores אם צריך */
export interface PansScores {
  ocdScore: number;         // 0–25
  associatedScore: number;  // 0–25
  functionalScore: number;  // 0–50
  totalScore: number;       // 0–100
}
