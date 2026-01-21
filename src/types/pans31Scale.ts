// ============================================================================
// PANS 31-Item Symptom Rating Scale Types
// Based on Murphy & Bernstein (2024) - Validated Scale
// License: CC BY-NC-SA 4.0
// ============================================================================

/**
 * Symptom severity rating (0-4)
 */
export type SeverityRating = 0 | 1 | 2 | 3 | 4;

/**
 * Rating labels in Hebrew with descriptions
 */
export const SEVERITY_LABELS: Record<SeverityRating, { short: string; description: string }> = {
  0: {
    short: 'אין',
    description: 'אין תסמינים',
  },
  1: {
    short: 'קל',
    description: 'הפרעה קלה במשפחה, בבית ספר או במצבים חברתיים. התסמינים אינם פוגעים בתפקוד.',
  },
  2: {
    short: 'בינוני',
    description: 'הפרעה ברורה במשפחה, בבית ספר או במצבים חברתיים, אך עדיין ניתנת לניהול.',
  },
  3: {
    short: 'חמור',
    description: 'גורם להפרעה משמעותית במשפחה, בבית ספר או במצבים חברתיים.',
  },
  4: {
    short: 'קיצוני',
    description: 'תסמינים משתקים.',
  },
};

/**
 * All 31 symptom items
 */
export interface PANS31Symptoms {
  // OCD & Eating (1-6)
  obsessions: SeverityRating;
  compulsions: SeverityRating;
  hoarding: SeverityRating;
  foodRefusal: SeverityRating;
  overeatingUrge: SeverityRating;
  fluidRefusal: SeverityRating;

  // Anxiety & Mood (7-12)
  separationAnxiety: SeverityRating;
  otherAnxiety: SeverityRating;
  moodSwings: SeverityRating;
  emotionalLability: SeverityRating;
  suicidalIdeation: SeverityRating;
  depression: SeverityRating;

  // Behavioral (13-19)
  irritability: SeverityRating;
  oppositionalBehaviors: SeverityRating;
  aggressiveBehaviors: SeverityRating;
  hyperactivityImpulsivity: SeverityRating;
  attentionProblems: SeverityRating;
  babyTalk: SeverityRating;
  developmentalRegression: SeverityRating;

  // Cognitive & Academic (20-22)
  schoolPerformance: SeverityRating;
  handwritingProblems: SeverityRating;
  cognitiveSymptoms: SeverityRating;

  // Somatic (23-27)
  pain: SeverityRating;
  sleepDisturbance: SeverityRating;
  enuresis: SeverityRating;
  urinaryFrequency: SeverityRating;
  sensoryAmplification: SeverityRating;

  // Psychosis & Tics (28-31)
  hallucinations: SeverityRating;
  delusions: SeverityRating;
  motorTics: SeverityRating;
  vocalTics: SeverityRating;
}

/**
 * Hebrew labels for all 31 symptoms with definitions
 */
export const PANS31_LABELS: Record<keyof PANS31Symptoms, { label: string; definition?: string }> = {
  // OCD & Eating
  obsessions: {
    label: 'אובססיות',
    definition: 'מחשבות או דימויים לא רצויים שחודרים לראש הילד. הם יכולים להיות מפחידים, מביכים או מוזרים. חלק מהילדים חושבים על דברים רעים שיקרו להוריהם, או על להיות חולים.',
  },
  compulsions: {
    label: 'כפייתיות',
    definition: 'שגרות, טקסים או פעולות שהילד מרגיש שהוא חייב לעשות כדי למנוע דברים רעים או עד ש"זה בדיוק נכון". חלק מהילדים מסדרים דברים בצורה מסוימת או מבקשים הרגעה מההורים.',
  },
  hoarding: {
    label: 'אגירה',
  },
  foodRefusal: {
    label: 'סירוב/הימנעות מאוכל',
  },
  overeatingUrge: {
    label: 'דחף לאכול יתר על המידה; חשיבה על אוכל כל הזמן',
  },
  fluidRefusal: {
    label: 'סירוב/הימנעות מנוזלים',
  },

  // Anxiety & Mood
  separationAnxiety: {
    label: 'חרדת פרידה',
  },
  otherAnxiety: {
    label: 'חרדה אחרת / פחדים / פוביות / התקפי פאניקה',
  },
  moodSwings: {
    label: 'תנודות במצב הרוח / מודיות',
    definition: 'כאשר מצב הרוח של הילד משתנה במהירות ובתדירות גבוהה. הילד יכול לעבור משמחה או רוגע לעצבות על משהו.',
  },
  emotionalLability: {
    label: 'תנודתיות רגשית (בכי או צחוק לא מתאימים)',
  },
  suicidalIdeation: {
    label: 'מחשבות/התנהגות אובדנית',
    definition: 'כאשר הילד חושב או מביע שהוא לא רוצה להיות בחיים יותר, או עושה משהו בכוונה לפגוע בעצמו. דוגמה: כשילד אומר שהוא רוצה למות או מעדיף להיות מת.',
  },
  depression: {
    label: 'דיכאון / עצבות',
  },

  // Behavioral
  irritability: {
    label: 'עצבנות',
    definition: 'כאשר הילד מתרגז או מופרע בקלות מדברים קטנים שבדרך כלל לא היו מרגיזים מישהו.',
  },
  oppositionalBehaviors: {
    label: 'התנהגויות מתנגדות',
  },
  aggressiveBehaviors: {
    label: 'התנהגויות תוקפניות ו/או זעם',
    definition: 'התנהגות שיכולה לגרום נזק פיזי או רגשי לאחרים. דוגמאות: צעקות, מכות/בעיטות, קטטות, הצקה לאחרים.',
  },
  hyperactivityImpulsivity: {
    label: 'היפראקטיביות או אימפולסיביות',
  },
  attentionProblems: {
    label: 'קשיי ריכוז',
  },
  babyTalk: {
    label: 'דיבור תינוקי',
  },
  developmentalRegression: {
    label: 'נסיגה התנהגותית/התפתחותית אחרת (טיפול עצמי ירוד, שיפוט לא בוגר לגיל)',
  },

  // Cognitive & Academic
  schoolPerformance: {
    label: 'הידרדרות בביצועים בבית הספר',
  },
  handwritingProblems: {
    label: 'הידרדרות בכתב יד / העתקה / יצירות',
  },
  cognitiveSymptoms: {
    label: 'תסמינים קוגניטיביים (קושי לחשוב, ערפול מוחי, בעיות זיכרון)',
  },

  // Somatic
  pain: {
    label: 'כאב (כאבי ראש, כאבי בטן, כאבי גוף)',
  },
  sleepDisturbance: {
    label: 'הפרעות שינה',
  },
  enuresis: {
    label: 'הרטבה ביום או בלילה (אנורזיס)',
  },
  urinaryFrequency: {
    label: 'תכיפות במתן שתן (שימוש תכוף בשירותים)',
  },
  sensoryAmplification: {
    label: 'מוטרד מקולות, ריחות, מרקמים או אורות (הגברה חושית)',
  },

  // Psychosis & Tics
  hallucinations: {
    label: 'הזיות',
    definition: 'כאשר הילד שומע או רואה דברים שלא קיימים בצורה שנראית מוזרה. חלק מהילדים שומעים קולות או רואים אנשים או דברים כשאף אחד לא שם.',
  },
  delusions: {
    label: 'אשליות או מחשבות פרנואידיות',
  },
  motorTics: {
    label: 'טיקים (תנועות)',
    definition: 'עוויתות או תנועות פתאומיות, כמו מצמוץ עיניים חזק או תנועת ראש מהירה לצד. טיקים מסוימים עדינים יותר, כמו כיווץ האף.',
  },
  vocalTics: {
    label: 'טיקים (קולות)',
    definition: 'השמעת קולות פתאומיים כמו ניקוי גרון, נחירה או מילים. דוגמאות נוספות: מילים או רעשים חוזרים, שיעול.',
  },
};

/**
 * Symptom categories for grouping in UI
 */
export const PANS31_CATEGORIES = {
  ocdEating: {
    title: 'OCD והפרעות אכילה',
    items: ['obsessions', 'compulsions', 'hoarding', 'foodRefusal', 'overeatingUrge', 'fluidRefusal'] as const,
  },
  anxietyMood: {
    title: 'חרדה ומצב רוח',
    items: ['separationAnxiety', 'otherAnxiety', 'moodSwings', 'emotionalLability', 'suicidalIdeation', 'depression'] as const,
  },
  behavioral: {
    title: 'התנהגות',
    items: ['irritability', 'oppositionalBehaviors', 'aggressiveBehaviors', 'hyperactivityImpulsivity', 'attentionProblems', 'babyTalk', 'developmentalRegression'] as const,
  },
  cognitiveAcademic: {
    title: 'קוגניטיבי ולימודי',
    items: ['schoolPerformance', 'handwritingProblems', 'cognitiveSymptoms'] as const,
  },
  somatic: {
    title: 'גופני',
    items: ['pain', 'sleepDisturbance', 'enuresis', 'urinaryFrequency', 'sensoryAmplification'] as const,
  },
  psychosisTics: {
    title: 'פסיכוזה וטיקים',
    items: ['hallucinations', 'delusions', 'motorTics', 'vocalTics'] as const,
  },
} as const;

/**
 * Additional data collected
 */
export interface PANS31AdditionalData {
  hoursObsessions: number | null;
  hoursCompulsions: number | null;
  completedBy: 'mother' | 'father' | 'other';
  otherCompletedBy?: string;
}

/**
 * Complete form data
 */
export interface PANS31FormData {
  symptoms: PANS31Symptoms;
  additional: PANS31AdditionalData;
}

/**
 * Calculated scores
 */
export interface PANS31Scores {
  total: number; // 0-124 (31 items × 4)
  categories: {
    ocdEating: number; // 0-24 (6 items × 4)
    anxietyMood: number; // 0-24 (6 items × 4)
    behavioral: number; // 0-28 (7 items × 4)
    cognitiveAcademic: number; // 0-12 (3 items × 4)
    somatic: number; // 0-20 (5 items × 4)
    psychosisTics: number; // 0-16 (4 items × 4)
  };
  severityLevel: 'minimal' | 'mild' | 'moderate' | 'severe' | 'extreme';
}

export const MAX_SCORES = {
  total: 124,
  categories: {
    ocdEating: 24,
    anxietyMood: 24,
    behavioral: 28,
    cognitiveAcademic: 12,
    somatic: 20,
    psychosisTics: 16,
  },
};

/**
 * Initial form state
 */
export const PANS31_INITIAL_STATE: PANS31FormData = {
  symptoms: {
    obsessions: 0,
    compulsions: 0,
    hoarding: 0,
    foodRefusal: 0,
    overeatingUrge: 0,
    fluidRefusal: 0,
    separationAnxiety: 0,
    otherAnxiety: 0,
    moodSwings: 0,
    emotionalLability: 0,
    suicidalIdeation: 0,
    depression: 0,
    irritability: 0,
    oppositionalBehaviors: 0,
    aggressiveBehaviors: 0,
    hyperactivityImpulsivity: 0,
    attentionProblems: 0,
    babyTalk: 0,
    developmentalRegression: 0,
    schoolPerformance: 0,
    handwritingProblems: 0,
    cognitiveSymptoms: 0,
    pain: 0,
    sleepDisturbance: 0,
    enuresis: 0,
    urinaryFrequency: 0,
    sensoryAmplification: 0,
    hallucinations: 0,
    delusions: 0,
    motorTics: 0,
    vocalTics: 0,
  },
  additional: {
    hoursObsessions: null,
    hoursCompulsions: null,
    completedBy: 'mother',
  },
};

/**
 * License information - MUST be displayed
 */
export const PANS31_LICENSE = {
  title: 'PANS 31-Item Symptom Rating Scale (PANS Scale)',
  authors: 'Tanya K. Murphy, MD, MS & Gail A. Bernstein, MD',
  year: 2024,
  license: 'CC BY-NC-SA 4.0',
  citation: 'Murphy, T.K. & Bernstein, G.A. (2024). PANS 31-Item Symptom Rating Scale (PANS Rating Scale).',
  validation: 'Bernstein GA, et al. J Child Adolesc Psychopharmacol. 2024. PMID: 38536004',
};
