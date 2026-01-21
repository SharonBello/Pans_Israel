// ============================================================================
// Caregiver Burden Inventory (CBI) Types
// Based on Novak & Guest (1989), validated for PANS by Farmer et al. (2018)
// ============================================================================

/**
 * Frequency rating (0-4)
 */
export type FrequencyRating = 0 | 1 | 2 | 3 | 4;

/**
 * Rating labels in Hebrew
 */
export const FREQUENCY_LABELS: Record<FrequencyRating, { short: string; english: string }> = {
  0: { short: 'אף פעם', english: 'Never' },
  1: { short: 'לעתים רחוקות', english: 'Rarely' },
  2: { short: 'לפעמים', english: 'Sometimes' },
  3: { short: 'לעתים קרובות', english: 'Quite Frequently' },
  4: { short: 'כמעט תמיד', english: 'Nearly Always' },
};

/**
 * All 24 CBI items grouped by subscale
 */
export interface CBIItems {
  // Time Dependency (5 items)
  timeDependency: {
    helpDailyTasks: FrequencyRating;
    dependent: FrequencyRating;
    watchConstantly: FrequencyRating;
    helpBasicFunctions: FrequencyRating;
    noBreak: FrequencyRating;
  };
  // Developmental (5 items)
  developmental: {
    missingOutOnLife: FrequencyRating;
    wishToEscape: FrequencyRating;
    socialLifeSuffered: FrequencyRating;
    emotionallyDrained: FrequencyRating;
    expectedDifferent: FrequencyRating;
  };
  // Physical Health (4 items)
  physical: {
    notEnoughSleep: FrequencyRating;
    healthSuffered: FrequencyRating;
    caregivingMadeSick: FrequencyRating;
    physicallyTired: FrequencyRating;
  };
  // Emotional Health (5 items)
  emotional: {
    feelEmbarrassed: FrequencyRating;
    ashamedOfChild: FrequencyRating;
    resentChild: FrequencyRating;
    uncomfortableFriendsOver: FrequencyRating;
    angryAboutInteractions: FrequencyRating;
  };
  // Social Relationships (5 items)
  social: {
    notGetAlongFamily: FrequencyRating;
    notAppreciated: FrequencyRating;
    marriageProblems: FrequencyRating;
    notGetAlongOthers: FrequencyRating;
    resentfulRelatives: FrequencyRating;
  };
}

/**
 * Hebrew labels for all 24 items
 */
export const CBI_ITEM_LABELS = {
  timeDependency: {
    title: 'תלות בזמן',
    description: 'עומס הנובע מהגבלת הזמן האישי שלך',
    items: {
      helpDailyTasks: 'ילדי זקוק לעזרתי לביצוע משימות יומיומיות רבות',
      dependent: 'ילדי תלוי בי',
      watchConstantly: 'אני צריך/ה לפקח על ילדי כל הזמן',
      helpBasicFunctions: 'אני צריך/ה לעזור לילדי בתפקודים בסיסיים (רחצה, אכילה וכו\')',
      noBreak: 'אין לי דקה של מנוחה מחובות הטיפול שלי',
    },
  },
  developmental: {
    title: 'התפתחותי',
    description: 'תחושה של "פספוס" בחיים בהשוואה לבני גילך',
    items: {
      missingOutOnLife: 'אני מרגיש/ה שאני מפספס/ת את החיים',
      wishToEscape: 'הלוואי שיכולתי להימלט מהמצב הזה',
      socialLifeSuffered: 'חיי החברה שלי נפגעו',
      emotionallyDrained: 'אני מרגיש/ה מרוקן/ת רגשית',
      expectedDifferent: 'ציפיתי שהדברים יהיו שונים בשלב הזה של החיים',
    },
  },
  physical: {
    title: 'בריאות גופנית',
    description: 'ההשפעה על בריאותך הפיזית',
    items: {
      notEnoughSleep: 'אני לא מקבל/ת מספיק שינה',
      healthSuffered: 'בריאותי נפגעה',
      caregivingMadeSick: 'הטיפול גרם לי לחלות',
      physicallyTired: 'אני עייף/ה פיזית',
    },
  },
  emotional: {
    title: 'בריאות רגשית',
    description: 'רגשות שליליים שעלולים להתעורר',
    items: {
      feelEmbarrassed: 'אני מרגיש/ה נבוך/ה מההתנהגות של ילדי',
      ashamedOfChild: 'אני מרגיש/ה בושה מילדי',
      resentChild: 'אני מרגיש/ה טינה כלפי ילדי',
      uncomfortableFriendsOver: 'אני לא מרגיש/ה בנוח כשחברים מגיעים',
      angryAboutInteractions: 'אני כועס/ת על האינטראקציות שלי עם ילדי',
    },
  },
  social: {
    title: 'יחסים חברתיים',
    description: 'השפעה על מערכות יחסים',
    items: {
      notGetAlongFamily: 'אני לא מסתדר/ת עם בני משפחה אחרים כמו פעם',
      notAppreciated: 'אני לא מרגיש/ה שהטיפול שלי מוערך',
      marriageProblems: 'היו לי בעיות בזוגיות/נישואין',
      notGetAlongOthers: 'אני לא מסתדר/ת עם חברים כמו פעם',
      resentfulRelatives: 'אני כועס/ת שקרובי משפחה לא עוזרים יותר',
    },
  },
};

/**
 * Subscale scoring info
 */
export const CBI_SUBSCALES = {
  timeDependency: { items: 5, maxScore: 20 },
  developmental: { items: 5, maxScore: 20 },
  physical: { items: 4, maxScore: 16 }, // Only 4 items
  emotional: { items: 5, maxScore: 20 },
  social: { items: 5, maxScore: 20 },
};

/**
 * Calculated scores
 */
export interface CBIScores {
  total: number; // 0-96 (24 items × 4)
  subscales: {
    timeDependency: number; // 0-20
    developmental: number; // 0-20
    physical: number; // 0-16 (or 0-20 if multiplied by 1.25)
    physicalAdjusted: number; // 0-20 (physical × 1.25)
    emotional: number; // 0-20
    social: number; // 0-20
  };
  burdenLevel: 'low' | 'moderate' | 'high' | 'severe';
  needsRespite: boolean; // Score > 36
}

export const MAX_SCORES = {
  total: 96,
  subscales: {
    timeDependency: 20,
    developmental: 20,
    physical: 16,
    physicalAdjusted: 20,
    emotional: 20,
    social: 20,
  },
};

/**
 * PANS-specific normative data (Farmer et al., 2018)
 */
export const PANS_NORMS = {
  mean: 36.7,
  sd: 19.8,
  median: 37,
  iqr: { low: 19, high: 53 },
  subscales: {
    timeDependency: { mean: 10.1, sd: 4.6, median: 11 },
    developmental: { mean: 9.7, sd: 6.1, median: 10 },
    physical: { mean: 6.6, sd: 4.5, median: 6 },
    emotional: { mean: 5.1, sd: 4.4, median: 5 },
    social: { mean: 5.1, sd: 5.1, median: 5 },
  },
};

/**
 * Initial form state
 */
export const CBI_INITIAL_STATE: CBIItems = {
  timeDependency: {
    helpDailyTasks: 0,
    dependent: 0,
    watchConstantly: 0,
    helpBasicFunctions: 0,
    noBreak: 0,
  },
  developmental: {
    missingOutOnLife: 0,
    wishToEscape: 0,
    socialLifeSuffered: 0,
    emotionallyDrained: 0,
    expectedDifferent: 0,
  },
  physical: {
    notEnoughSleep: 0,
    healthSuffered: 0,
    caregivingMadeSick: 0,
    physicallyTired: 0,
  },
  emotional: {
    feelEmbarrassed: 0,
    ashamedOfChild: 0,
    resentChild: 0,
    uncomfortableFriendsOver: 0,
    angryAboutInteractions: 0,
  },
  social: {
    notGetAlongFamily: 0,
    notAppreciated: 0,
    marriageProblems: 0,
    notGetAlongOthers: 0,
    resentfulRelatives: 0,
  },
};

/**
 * Additional demographic data
 */
export interface CBIDemographics {
  relationshipToChild: 'mother' | 'father' | 'both' | 'other';
  otherRelationship?: string;
  reducedWorkHours: boolean;
  changedSchooling: boolean;
  missedSchoolDays: boolean; // 1+ days per week
}

/**
 * Complete form data
 */
export interface CBIFormData {
  items: CBIItems;
  demographics: CBIDemographics;
}

/**
 * Citation information
 */
export const CBI_CITATION = {
  original: {
    authors: 'Novak M, Guest C',
    year: 1989,
    title: 'Application of a multidimensional caregiver burden inventory',
    journal: 'Gerontologist',
    volume: '29(6)',
    pages: '798-803',
    doi: '10.1093/geront/29.6.798',
  },
  pansValidation: {
    authors: 'Farmer C, Thienemann M, Leibold C, Kamalani G, Sauls B, Frankovich J',
    year: 2018,
    title: 'Psychometric Evaluation of the Caregiver Burden Inventory in Children and Adolescents With PANS',
    journal: 'J Pediatr Psychol',
    volume: '43(7)',
    pages: '749-757',
    doi: '10.1093/jpepsy/jsy014',
    pmcid: 'PMC6054236',
  },
};
