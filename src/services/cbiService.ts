import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  onSnapshot,
  getDocs,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PANS_NORMS, type CBIFormData, type CBIItems, type CBIScores, type FrequencyRating } from '@/types/cbiScale';

// ============================================================================
// Firestore Document Structure
// ============================================================================

export interface CBIResultDocument {
  sessionId: string;
  scaleType: 'CBI';
  timestamp: Timestamp;
  formData: CBIFormData;
  scores: CBIScores;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate subscale score
 */
function sumSubscale(items: Record<string, FrequencyRating>): number {
  const values = Object.values(items) as number[];
  return values.reduce<number>((sum, val) => sum + val, 0);
}

/**
 * Determine burden level based on total score
 */
function getBurdenLevel(total: number): 'low' | 'moderate' | 'high' | 'severe' {
  // Based on PANS norms (mean 36.7, SD 19.8)
  if (total <= 20) return 'low'; // Below 1 SD below mean
  if (total <= 36) return 'moderate'; // Around mean
  if (total <= 56) return 'high'; // 1 SD above mean
  return 'severe'; // >1 SD above mean
}

/**
 * Get burden level info
 */
export function getBurdenInfo(level: CBIScores['burdenLevel']): {
  label: string;
  color: string;
  description: string;
} {
  const info = {
    low: {
      label: 'נמוך',
      color: '#4CAF50',
      description: 'רמת עומס נמוכה. חשוב לשמור על תמיכה עצמית.',
    },
    moderate: {
      label: 'בינוני',
      color: '#FFC107',
      description: 'רמת עומס בינונית - דומה לממוצע בקרב הורים לילדים עם PANS.',
    },
    high: {
      label: 'גבוה',
      color: '#FF9800',
      description: 'רמת עומס גבוהה. מומלץ לפנות לתמיכה.',
    },
    severe: {
      label: 'חמור',
      color: '#F44336',
      description: 'רמת עומס חמורה. חשוב מאוד לבקש עזרה ותמיכה.',
    },
  };
  return info[level];
}

/**
 * Calculate all CBI scores
 */
export function calculateCBIScores(items: CBIItems): CBIScores {
  const subscales = {
    timeDependency: sumSubscale(items.timeDependency),
    developmental: sumSubscale(items.developmental),
    physical: sumSubscale(items.physical),
    physicalAdjusted: Math.round(sumSubscale(items.physical) * 1.25), // Multiply by 1.25 for equivalent score
    emotional: sumSubscale(items.emotional),
    social: sumSubscale(items.social),
  };

  const total =
    subscales.timeDependency +
    subscales.developmental +
    subscales.physical +
    subscales.emotional +
    subscales.social;

  const burdenLevel = getBurdenLevel(total);
  const needsRespite = total > 36; // Clinical threshold

  return {
    total,
    subscales,
    burdenLevel,
    needsRespite,
  };
}

/**
 * Compare score to PANS norms
 */
export function compareToNorms(scores: CBIScores): {
  percentile: string;
  comparison: 'below' | 'average' | 'above';
  description: string;
} {
  const { mean, sd } = PANS_NORMS;
  const zScore = (scores.total - mean) / sd;

  if (zScore < -1) {
    return {
      percentile: 'מתחת ל-16%',
      comparison: 'below',
      description: 'הציון שלך נמוך מרוב ההורים לילדים עם PANS',
    };
  } else if (zScore < 1) {
    return {
      percentile: '16%-84%',
      comparison: 'average',
      description: 'הציון שלך בטווח הממוצע להורים לילדים עם PANS',
    };
  } else {
    return {
      percentile: 'מעל 84%',
      comparison: 'above',
      description: 'הציון שלך גבוה מרוב ההורים לילדים עם PANS',
    };
  }
}

// ============================================================================
// Firebase Operations
// ============================================================================

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return 'cbi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save CBI results to Firestore
 */
export async function saveCBIResult(formData: CBIFormData): Promise<string> {
  try {
    let sessionId = localStorage.getItem('cbiSessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('cbiSessionId', sessionId);
    }

    const scores = calculateCBIScores(formData.items);

    const resultDoc: Omit<CBIResultDocument, 'timestamp'> & { timestamp: Timestamp } = {
      sessionId,
      scaleType: 'CBI',
      timestamp: Timestamp.now(),
      formData,
      scores,
    };

    const docRef = await addDoc(collection(db, 'cbiResults'), resultDoc);
    console.log('✅ CBI result saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving CBI result:', error);
    throw error;
  }
}

/**
 * Subscribe to CBI results
 */
export function subscribeToCBIResults(
  callback: (results: CBIResultDocument[]) => void,
  limitCount: number = 100
): () => void {
  const q = query(
    collection(db, 'cbiResults'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const results: CBIResultDocument[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as CBIResultDocument);
      });
      callback(results);
    },
    (error) => {
      console.error('❌ Error in CBI subscription:', error);
    }
  );

  return unsubscribe;
}

/**
 * Get user's CBI history
 */
export async function getUserCBIHistory(sessionId: string): Promise<CBIResultDocument[]> {
  try {
    const q = query(
      collection(db, 'cbiResults'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const results: CBIResultDocument[] = [];
    snapshot.forEach((doc) => {
      results.push(doc.data() as CBIResultDocument);
    });

    return results;
  } catch (error) {
    console.error('❌ Error fetching CBI history:', error);
    return [];
  }
}

// ============================================================================
// Aggregation for Charts
// ============================================================================

export interface CBIAggregatedData {
  count: number;
  averageTotal: number;
  averageSubscales: CBIScores['subscales'];
  burdenDistribution: {
    low: number;
    moderate: number;
    high: number;
    severe: number;
  };
  needsRespiteCount: number;
  needsRespitePercent: number;
  demographicBreakdown: {
    reducedWorkHours: { yes: number; no: number };
    changedSchooling: { yes: number; no: number };
    missedSchoolDays: { yes: number; no: number };
  };
}

export function aggregateCBIResults(results: CBIResultDocument[]): CBIAggregatedData {
  if (results.length === 0) {
    return {
      count: 0,
      averageTotal: 0,
      averageSubscales: {
        timeDependency: 0,
        developmental: 0,
        physical: 0,
        physicalAdjusted: 0,
        emotional: 0,
        social: 0,
      },
      burdenDistribution: { low: 0, moderate: 0, high: 0, severe: 0 },
      needsRespiteCount: 0,
      needsRespitePercent: 0,
      demographicBreakdown: {
        reducedWorkHours: { yes: 0, no: 0 },
        changedSchooling: { yes: 0, no: 0 },
        missedSchoolDays: { yes: 0, no: 0 },
      },
    };
  }

  const count = results.length;
  let totalSum = 0;
  const subscaleSums = {
    timeDependency: 0,
    developmental: 0,
    physical: 0,
    physicalAdjusted: 0,
    emotional: 0,
    social: 0,
  };
  const burdenDistribution = { low: 0, moderate: 0, high: 0, severe: 0 };
  let needsRespiteCount = 0;
  const demographicBreakdown = {
    reducedWorkHours: { yes: 0, no: 0 },
    changedSchooling: { yes: 0, no: 0 },
    missedSchoolDays: { yes: 0, no: 0 },
  };

  results.forEach((r) => {
    totalSum += r.scores.total;

    // Sum subscales
    Object.keys(subscaleSums).forEach((key) => {
      subscaleSums[key as keyof typeof subscaleSums] +=
        r.scores.subscales[key as keyof typeof subscaleSums];
    });

    // Burden distribution
    burdenDistribution[r.scores.burdenLevel]++;

    // Respite
    if (r.scores.needsRespite) needsRespiteCount++;

    // Demographics
    if (r.formData.demographics) {
      if (r.formData.demographics.reducedWorkHours) {
        demographicBreakdown.reducedWorkHours.yes++;
      } else {
        demographicBreakdown.reducedWorkHours.no++;
      }
      if (r.formData.demographics.changedSchooling) {
        demographicBreakdown.changedSchooling.yes++;
      } else {
        demographicBreakdown.changedSchooling.no++;
      }
      if (r.formData.demographics.missedSchoolDays) {
        demographicBreakdown.missedSchoolDays.yes++;
      } else {
        demographicBreakdown.missedSchoolDays.no++;
      }
    }
  });

  return {
    count,
    averageTotal: Math.round(totalSum / count * 10) / 10,
    averageSubscales: {
      timeDependency: Math.round((subscaleSums.timeDependency / count) * 10) / 10,
      developmental: Math.round((subscaleSums.developmental / count) * 10) / 10,
      physical: Math.round((subscaleSums.physical / count) * 10) / 10,
      physicalAdjusted: Math.round((subscaleSums.physicalAdjusted / count) * 10) / 10,
      emotional: Math.round((subscaleSums.emotional / count) * 10) / 10,
      social: Math.round((subscaleSums.social / count) * 10) / 10,
    },
    burdenDistribution,
    needsRespiteCount,
    needsRespitePercent: Math.round((needsRespiteCount / count) * 100),
    demographicBreakdown,
  };
}
