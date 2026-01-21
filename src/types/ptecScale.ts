// ============================================================================
// PTEC Scale Types
// PANS/PANDAS Treatment and Flare Evaluation Checklist
// Based on Neuroimmune Foundation's PTEC tool
// ============================================================================

/**
 * Symptom severity rating (0-3)
 */
export type PtecSymptomRating = 0 | 1 | 2 | 3;

/**
 * Rating labels in Hebrew
 */
export const RATING_LABELS: Record<PtecSymptomRating, string> = {
  0: 'ללא קושי',
  1: 'קושי קל',
  2: 'קושי בינוני',
  3: 'קושי חמור',
};

/**
 * Flare status options
 */
export type FlareStatus = 'ongoing_flare' | 'new_flare' | 'no_flare';

export const FLARE_STATUS_LABELS: Record<FlareStatus, string> = {
  ongoing_flare: 'חווה כרגע התלקחות מתמשכת',
  new_flare: 'חווה כרגע התלקחות חדשה',
  no_flare: 'לא חווה כרגע התלקחות',
};

/**
 * Evaluation type
 */
export type EvaluationType = 'first_current' | 'first_historical' | 'followup';

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, string> = {
  first_current: 'פעם ראשונה - מתאר מצב נוכחי',
  first_historical: 'פעם ראשונה - מתאר מצב היסטורי בתחילת המחלה',
  followup: 'מעקב - מילאתי בעבר ועוקב אחר שינויים',
};

/**
 * Diagnosis options
 */
export type DiagnosisType = 'pans' | 'pandas' | 'other' | 'undiagnosed';

export const DIAGNOSIS_LABELS: Record<DiagnosisType, string> = {
  pans: 'PANS',
  pandas: 'PANDAS',
  other: 'הפרעה דלקתית אחרת במוח',
  undiagnosed: 'לא מאובחן',
};

/**
 * Trigger/illness options
 */
export type TriggerType =
  | 'strep_exposure'
  | 'strep_confirmed'
  | 'covid'
  | 'influenza'
  | 'viral_other'
  | 'bacterial_other'
  | 'allergen'
  | 'parasitic'
  | 'stress_trauma'
  | 'environmental'
  | 'other_trigger'
  | 'suspected_unknown'
  | 'none';

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  strep_exposure: 'חשיפה לסטרפטוקוק A ללא זיהום',
  strep_confirmed: 'זיהום סטרפטוקוק A מאושר',
  covid: 'COVID-19',
  influenza: 'שפעת',
  viral_other: 'זיהום ויראלי אחר',
  bacterial_other: 'זיהום חיידקי אחר',
  allergen: 'חשיפה לאלרגן',
  parasitic: 'זיהום טפילי',
  stress_trauma: 'לחץ/טראומה משמעותיים',
  environmental: 'חשיפה סביבתית',
  other_trigger: 'טריגר אחר',
  suspected_unknown: 'חשד לטריגר אך לא ידוע מהו',
  none: 'אין טריגר ידוע',
};

/**
 * Patient metadata
 */
export interface PTECPatientInfo {
  ageInYears: number;
  biologicalSex: 'male' | 'female';
  flareStatus: FlareStatus;
  evaluationType: EvaluationType;
  recentTreatment: boolean;
  recentTrigger: TriggerType;
  diagnosis: DiagnosisType;
}

// ============================================================================
// SYMPTOM CATEGORIES
// ============================================================================

/**
 * Behavior/Mood symptoms (20 items)
 */
export interface BehaviorMoodSymptoms {
  rages: PtecSymptomRating;
  schoolRefusal: PtecSymptomRating;
  uncooperative: PtecSymptomRating;
  oppositional: PtecSymptomRating;
  nonCompliant: PtecSymptomRating;
  tantrums: PtecSymptomRating;
  shoutsScreams: PtecSymptomRating;
  insensitive: PtecSymptomRating;
  inappropriateLaughCry: PtecSymptomRating;
  impulsive: PtecSymptomRating;
  avoidsContact: PtecSymptomRating;
  selfHarm: PtecSymptomRating;
  irritable: PtecSymptomRating;
  destructive: PtecSymptomRating;
  verbalAggression: PtecSymptomRating;
  physicalAggression: PtecSymptomRating;
  unhappyCrying: PtecSymptomRating;
  depressedMood: PtecSymptomRating;
  noMotivation: PtecSymptomRating;
  moodSwings: PtecSymptomRating;
}

export const BEHAVIOR_MOOD_LABELS: Record<keyof BehaviorMoodSymptoms, string> = {
  rages: 'התפרצויות זעם',
  schoolRefusal: 'סירוב ללכת לבית ספר',
  uncooperative: 'חוסר שיתוף פעולה או התנגדות',
  oppositional: 'התנהגות מתנגדת',
  nonCompliant: 'אי ציות',
  tantrums: 'התקפי זעם',
  shoutsScreams: 'צועק או צורח',
  insensitive: 'חוסר רגישות לרגשות אחרים',
  inappropriateLaughCry: 'צחוק/בכי לא מתאימים',
  impulsive: 'חסר עכבות/אימפולסיבי',
  avoidsContact: 'נמנע ממגע עם אחרים',
  selfHarm: 'פוגע בעצמו',
  irritable: 'עצבני/מסוער',
  destructive: 'הרסני לרכוש',
  verbalAggression: 'תוקפנות מילולית',
  physicalAggression: 'תוקפנות פיזית',
  unhappyCrying: 'עצוב/בוכה',
  depressedMood: 'מצב רוח מדוכא',
  noMotivation: 'חוסר מוטיבציה/שמחה',
  moodSwings: 'תנודות במצב הרוח',
};

/**
 * OCD symptoms (27 items)
 */
export interface OCDSymptoms {
  sexualThoughts: PtecSymptomRating;
  violentImages: PtecSymptomRating;
  intrusiveThoughts: PtecSymptomRating;
  germFear: PtecSymptomRating;
  washingCompulsions: PtecSymptomRating;
  chemicalFear: PtecSymptomRating;
  fearHarmSelf: PtecSymptomRating;
  fearHurtingOthers: PtecSymptomRating;
  fearAggressiveBehavior: PtecSymptomRating;
  fearObscenities: PtecSymptomRating;
  perfectionism: PtecSymptomRating;
  checkingRituals: PtecSymptomRating;
  countingRituals: PtecSymptomRating;
  confessing: PtecSymptomRating;
  reassuranceSeeking: PtecSymptomRating;
  obsessiveSpeech: PtecSymptomRating;
  repetitiveSpeech: PtecSymptomRating;
  rigidRoutines: PtecSymptomRating;
  hoardingRituals: PtecSymptomRating;
  magicalThoughts: PtecSymptomRating;
  luckyUnlucky: PtecSymptomRating;
  requiresSymmetry: PtecSymptomRating;
  arrangingObsessions: PtecSymptomRating;
  orderObsession: PtecSymptomRating;
  needToTap: PtecSymptomRating;
  healthConcern: PtecSymptomRating;
  requiresParticipation: PtecSymptomRating;
}

export const OCD_LABELS: Record<keyof OCDSymptoms, string> = {
  sexualThoughts: 'מחשבות מיניות לא רצויות',
  violentImages: 'דימויים אלימים/מזעזעים חודרניים',
  intrusiveThoughts: 'מחשבות חודרניות לא אלימות',
  germFear: 'אובססיה/פחד מחיידקים',
  washingCompulsions: 'כפייתיות רחצה/ניקיון',
  chemicalFear: 'פחד מכימיקלים/ממסים/מזהמים',
  fearHarmSelf: 'פחד שיגרם נזק לעצמו',
  fearHurtingOthers: 'פחד לפגוע בעצמו/באחרים',
  fearAggressiveBehavior: 'פחד להיות אחראי להתנהגות תוקפנית/לא חוקית',
  fearObscenities: 'פחד לפלוט גסויות',
  perfectionism: 'פרפקציוניזם',
  checkingRituals: 'אובססיות/טקסי בדיקה או חזרה',
  countingRituals: 'טקסי ספירה',
  confessing: 'צורך להתוודות',
  reassuranceSeeking: 'חיפוש הרגעה',
  obsessiveSpeech: 'דיבור אובססיבי',
  repetitiveSpeech: 'דיבור חוזרני',
  rigidRoutines: 'שגרות נוקשות',
  hoardingRituals: 'טקסי אגירה',
  magicalThoughts: 'מחשבות קסומות/אובססיות אמונות טפלות',
  luckyUnlucky: 'מילים/מספרים/צבעים מזל/ביש מזל',
  requiresSymmetry: 'דורש סימטריה',
  arrangingObsessions: 'אובססיות סידור',
  orderObsession: 'אובססיה לסדר/מיקום חפצים',
  needToTap: 'צורך לנגוע או להקיש',
  healthConcern: 'דאגה מוגזמת לבריאות',
  requiresParticipation: 'דורש מאחרים להשתתף ב-OCD',
};

/**
 * Anxiety symptoms (5 items)
 */
export interface AnxietySymptoms {
  separationAnxiety: PtecSymptomRating;
  irrationalFears: PtecSymptomRating;
  avoidsLeavingHome: PtecSymptomRating;
  socialAnxiety: PtecSymptomRating;
  generalAnxiety: PtecSymptomRating;
}

export const ANXIETY_LABELS: Record<keyof AnxietySymptoms, string> = {
  separationAnxiety: 'חרדת פרידה',
  irrationalFears: 'פחדים לא רציונליים או מוגזמים',
  avoidsLeavingHome: 'נמנע מלצאת מהבית',
  socialAnxiety: 'חרדה להיות סביב אנשים',
  generalAnxiety: 'חרדה כללית/אחרת',
};

/**
 * Food intake symptoms (8 items)
 */
export interface FoodIntakeSymptoms {
  foodRefusal: PtecSymptomRating;
  limitedFluid: PtecSymptomRating;
  pickyEating: PtecSymptomRating;
  negativeBodyImage: PtecSymptomRating;
  chokingFear: PtecSymptomRating;
  limitedNoReason: PtecSymptomRating;
  contaminationFear: PtecSymptomRating;
  overeating: PtecSymptomRating;
}

export const FOOD_INTAKE_LABELS: Record<keyof FoodIntakeSymptoms, string> = {
  foodRefusal: 'סירוב לאכול/אנורקסיה',
  limitedFluid: 'צריכת נוזלים מוגבלת',
  pickyEating: 'אכילה בררנית',
  negativeBodyImage: 'תדמית גוף שלילית',
  chokingFear: 'הגבלה בגלל פחד מחנק או הקאה',
  limitedNoReason: 'הגבלה ללא יכולת לנמק',
  contaminationFear: 'הגבלה בגלל פחד מזיהום',
  overeating: 'דחף לאכול יתר על המידה',
};

/**
 * Tics symptoms (2 items)
 */
export interface TicsSymptoms {
  vocalTics: PtecSymptomRating;
  motorTics: PtecSymptomRating;
}

export const TICS_LABELS: Record<keyof TicsSymptoms, string> = {
  vocalTics: 'טיקים קוליים',
  motorTics: 'טיקים מוטוריים',
};

/**
 * Cognitive/Developmental symptoms (7 items)
 */
export interface CognitiveSymptoms {
  memoryIssues: PtecSymptomRating;
  brainFog: PtecSymptomRating;
  stutters: PtecSymptomRating;
  babyTalk: PtecSymptomRating;
  grossMotorRegression: PtecSymptomRating;
  fineMotorRegression: PtecSymptomRating;
  mathRegression: PtecSymptomRating;
}

export const COGNITIVE_LABELS: Record<keyof CognitiveSymptoms, string> = {
  memoryIssues: 'בעיות זיכרון',
  brainFog: 'ערפול מוחי',
  stutters: 'גמגום',
  babyTalk: 'דיבור תינוקי',
  grossMotorRegression: 'נסיגה מוטורית גסה (מעידות/קואורדינציה)',
  fineMotorRegression: 'קושי/נסיגה בכתיבה/ציור',
  mathRegression: 'קושי/נסיגה במתמטיקה',
};

/**
 * Sensory symptoms (6 items)
 */
export interface SensorySymptoms {
  soundSensitive: PtecSymptomRating;
  lightSensitive: PtecSymptomRating;
  smellSensitive: PtecSymptomRating;
  textureSensitive: PtecSymptomRating;
  otherSensory: PtecSymptomRating;
  sensorySeeking: PtecSymptomRating;
}

export const SENSORY_LABELS: Record<keyof SensorySymptoms, string> = {
  soundSensitive: 'רגישות לקולות',
  lightSensitive: 'רגישות לאור',
  smellSensitive: 'רגישות לריחות',
  textureSensitive: 'רגישות למרקמים',
  otherSensory: 'רגישויות חושיות אחרות',
  sensorySeeking: 'חיפוש גירויים חושיים מוגבר',
};

/**
 * Other symptoms (12 items)
 */
export interface OtherSymptoms {
  hallucinations: PtecSymptomRating;
  delusions: PtecSymptomRating;
  paranoia: PtecSymptomRating;
  suicidalIdeation: PtecSymptomRating;
  homicidalIdeation: PtecSymptomRating;
  attentionIssues: PtecSymptomRating;
  hyperactivity: PtecSymptomRating;
  urinaryFrequency: PtecSymptomRating;
  daytimeWetting: PtecSymptomRating;
  lacksFriends: PtecSymptomRating;
  dilatedPupils: PtecSymptomRating;
}

export const OTHER_LABELS: Record<keyof OtherSymptoms, string> = {
  hallucinations: 'הזיות',
  delusions: 'אשליות',
  paranoia: 'פרנויה',
  suicidalIdeation: 'מחשבות אובדניות',
  homicidalIdeation: 'מחשבות רצחניות',
  attentionIssues: 'בעיות קשב',
  hyperactivity: 'היפראקטיביות',
  urinaryFrequency: 'תכיפות במתן שתן ביום',
  daytimeWetting: 'הרטבה/לכלוך ביום',
  lacksFriends: 'חסר חברים',
  dilatedPupils: 'אישונים מורחבים',
};

/**
 * Sleep symptoms (5 items)
 */
export interface SleepSymptoms {
  nightmares: PtecSymptomRating;
  nightTerrors: PtecSymptomRating;
  fallingAsleep: PtecSymptomRating;
  stayingAsleep: PtecSymptomRating;
  bedwetting: PtecSymptomRating;
}

export const SLEEP_LABELS: Record<keyof SleepSymptoms, string> = {
  nightmares: 'סיוטים',
  nightTerrors: 'בעתות לילה',
  fallingAsleep: 'בעיות להירדם',
  stayingAsleep: 'בעיות להישאר ישן',
  bedwetting: 'הרטבת לילה',
};

/**
 * Health symptoms (10 items)
 */
export interface HealthSymptoms {
  constipation: PtecSymptomRating;
  diarrhea: PtecSymptomRating;
  acuteInfection: PtecSymptomRating;
  fatigued: PtecSymptomRating;
  lethargic: PtecSymptomRating;
  stomachPain: PtecSymptomRating;
  headPain: PtecSymptomRating;
  jointPain: PtecSymptomRating;
  otherPain: PtecSymptomRating;
  dysautonomia: PtecSymptomRating;
}

export const HEALTH_LABELS: Record<keyof HealthSymptoms, string> = {
  constipation: 'עצירות',
  diarrhea: 'שלשול',
  acuteInfection: 'זיהום חריף',
  fatigued: 'עייפות',
  lethargic: 'רפיון',
  stomachPain: 'כאבי בטן',
  headPain: 'כאבי ראש',
  jointPain: 'כאבי מפרקים',
  otherPain: 'כאבים אחרים',
  dysautonomia: 'דיסאוטונומיה/סחרחורת',
};

// ============================================================================
// COMPLETE FORM DATA
// ============================================================================

export interface PTECSymptomData {
  behaviorMood: BehaviorMoodSymptoms;
  ocd: OCDSymptoms;
  anxiety: AnxietySymptoms;
  foodIntake: FoodIntakeSymptoms;
  tics: TicsSymptoms;
  cognitive: CognitiveSymptoms;
  sensory: SensorySymptoms;
  other: OtherSymptoms;
  sleep: SleepSymptoms;
  health: HealthSymptoms;
}

export interface PTECFormData {
  patientInfo: PTECPatientInfo;
  symptoms: PTECSymptomData;
  notes?: string;
}

// ============================================================================
// SCORING
// ============================================================================

export interface PTECScores {
  behaviorMood: number; // Max: 60 (20 items × 3)
  ocd: number; // Max: 81 (27 items × 3)
  anxiety: number; // Max: 15 (5 items × 3)
  foodIntake: number; // Max: 24 (8 items × 3)
  tics: number; // Max: 6 (2 items × 3)
  cognitive: number; // Max: 21 (7 items × 3)
  sensory: number; // Max: 18 (6 items × 3)
  other: number; // Max: 33 (11 items × 3)
  sleep: number; // Max: 15 (5 items × 3)
  health: number; // Max: 30 (10 items × 3)
  total: number; // Max: 306
}

export const MAX_SCORES: PTECScores = {
  behaviorMood: 60,
  ocd: 81,
  anxiety: 15,
  foodIntake: 24,
  tics: 6,
  cognitive: 21,
  sensory: 18,
  other: 33,
  sleep: 15,
  health: 30,
  total: 306,
};

export const CATEGORY_LABELS: Record<keyof Omit<PTECScores, 'total'>, string> = {
  behaviorMood: 'התנהגות/מצב רוח',
  ocd: 'OCD',
  anxiety: 'חרדה',
  foodIntake: 'אכילה',
  tics: 'טיקים',
  cognitive: 'קוגניטיבי/התפתחותי',
  sensory: 'חושי',
  other: 'אחר',
  sleep: 'שינה',
  health: 'בריאות',
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialSymptoms = <T extends object>(keys: readonly (keyof T)[]): T => {
  const result: Partial<Record<keyof T, PtecSymptomRating>> = {};

  for (const key of keys) {
    result[key] = 0;
  }

  return result as T;
};


export const PTEC_INITIAL_STATE: PTECFormData = {
  patientInfo: {
    ageInYears: 0,
    biologicalSex: 'male',
    flareStatus: 'no_flare',
    evaluationType: 'first_current',
    recentTreatment: false,
    recentTrigger: 'none',
    diagnosis: 'undiagnosed',
  },
  symptoms: {
    behaviorMood: createInitialSymptoms<BehaviorMoodSymptoms>(
      Object.keys(BEHAVIOR_MOOD_LABELS) as (keyof BehaviorMoodSymptoms)[]
    ),
    ocd: createInitialSymptoms<OCDSymptoms>(
      Object.keys(OCD_LABELS) as (keyof OCDSymptoms)[]
    ),
    anxiety: createInitialSymptoms<AnxietySymptoms>(
      Object.keys(ANXIETY_LABELS) as (keyof AnxietySymptoms)[]
    ),
    foodIntake: createInitialSymptoms<FoodIntakeSymptoms>(
      Object.keys(FOOD_INTAKE_LABELS) as (keyof FoodIntakeSymptoms)[]
    ),
    tics: createInitialSymptoms<TicsSymptoms>(
      Object.keys(TICS_LABELS) as (keyof TicsSymptoms)[]
    ),
    cognitive: createInitialSymptoms<CognitiveSymptoms>(
      Object.keys(COGNITIVE_LABELS) as (keyof CognitiveSymptoms)[]
    ),
    sensory: createInitialSymptoms<SensorySymptoms>(
      Object.keys(SENSORY_LABELS) as (keyof SensorySymptoms)[]
    ),
    other: createInitialSymptoms<OtherSymptoms>(
      Object.keys(OTHER_LABELS) as (keyof OtherSymptoms)[]
    ),
    sleep: createInitialSymptoms<SleepSymptoms>(
      Object.keys(SLEEP_LABELS) as (keyof SleepSymptoms)[]
    ),
    health: createInitialSymptoms<HealthSymptoms>(
      Object.keys(HEALTH_LABELS) as (keyof HealthSymptoms)[]
    ),
  },
  notes: '',
};
