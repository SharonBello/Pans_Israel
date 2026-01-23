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
import { PANS31_CATEGORIES, type PANS31FormData, type PANS31Scores, type PANS31Symptoms, type SeverityRating } from '@/types/pans31Scale';
import { MAX_SCORES } from '@/types/ptecScale';


// ============================================================================
// Firestore Document Structure
// ============================================================================

export interface PANS31ResultDocument {
  sessionId: string;
  scaleType: 'PANS31';
  timestamp: Timestamp;
  formData: PANS31FormData;
  scores: PANS31Scores;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate category score
 */
function calculateCategoryScore(
  symptoms: PANS31Symptoms,
  items: readonly (keyof PANS31Symptoms)[]
): number {
  return items.reduce((sum, item) => sum + (symptoms[item] as number), 0);
}

/**
 * Determine severity level based on total score
 * Based on clinical interpretation guidelines
 */
function getSeverityLevel(
  totalScore: number
): 'minimal' | 'mild' | 'moderate' | 'severe' | 'extreme' {
  const percentage = (totalScore / MAX_SCORES.total) * 100;

  if (percentage <= 10) return 'minimal';
  if (percentage <= 25) return 'mild';
  if (percentage <= 50) return 'moderate';
  if (percentage <= 75) return 'severe';
  return 'extreme';
}

/**
 * Get severity label and color
 */
export function getSeverityInfo(level: PANS31Scores['severityLevel']): {
  label: string;
  color: string;
  description: string;
} {
  const info = {
    minimal: {
      label: 'מינימלי',
      color: '#4CAF50',
      description: 'תסמינים מינימליים או ללא תסמינים',
    },
    mild: {
      label: 'קל',
      color: '#8BC34A',
      description: 'תסמינים קלים עם השפעה מינימלית על התפקוד',
    },
    moderate: {
      label: 'בינוני',
      color: '#FFC107',
      description: 'תסמינים בינוניים עם השפעה על התפקוד היומיומי',
    },
    severe: {
      label: 'חמור',
      color: '#FF9800',
      description: 'תסמינים חמורים עם השפעה משמעותית על התפקוד',
    },
    extreme: {
      label: 'קיצוני',
      color: '#F44336',
      description: 'תסמינים קיצוניים המשפיעים באופן חמור על כל תחומי החיים',
    },
  };

  return info[level];
}

/**
 * Calculate all PANS 31 scores
 */
export function calculatePANS31Scores(symptoms: PANS31Symptoms): PANS31Scores {
  const categories = {
    ocdEating: calculateCategoryScore(symptoms, PANS31_CATEGORIES.ocdEating.items),
    anxietyMood: calculateCategoryScore(symptoms, PANS31_CATEGORIES.anxietyMood.items),
    behavioral: calculateCategoryScore(symptoms, PANS31_CATEGORIES.behavioral.items),
    cognitiveAcademic: calculateCategoryScore(symptoms, PANS31_CATEGORIES.cognitiveAcademic.items),
    somatic: calculateCategoryScore(symptoms, PANS31_CATEGORIES.somatic.items),
    psychosisTics: calculateCategoryScore(symptoms, PANS31_CATEGORIES.psychosisTics.items),
  };

  const total = Object.values(categories).reduce((sum, score) => sum + score, 0);
  const severityLevel = getSeverityLevel(total);

  return {
    total,
    categories,
    severityLevel,
  };
}

/**
 * Get items with highest severity (for highlighting concerns)
 */
export function getHighSeverityItems(
  symptoms: PANS31Symptoms,
  threshold: SeverityRating = 3
): { key: keyof PANS31Symptoms; rating: SeverityRating }[] {
  return (Object.entries(symptoms) as [keyof PANS31Symptoms, SeverityRating][])
    .filter(([_, rating]) => rating >= threshold)
    .map(([key, rating]) => ({ key, rating }))
    .sort((a, b) => b.rating - a.rating);
}

// ============================================================================
// Firebase Operations
// ============================================================================

/**
 * Generate a session ID for PANS31
 */
function generateSessionId(): string {
  return 'pans31_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save PANS31 results to Firestore
 */
export async function savePANS31Result(formData: PANS31FormData): Promise<string> {
  try {
    // Get or create session ID
    let sessionId = localStorage.getItem('pans31SessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('pans31SessionId', sessionId);
    }

    // Calculate scores
    const scores = calculatePANS31Scores(formData.symptoms);

    // Create document
    const resultDoc: Omit<PANS31ResultDocument, 'timestamp'> & { timestamp: Timestamp } = {
      sessionId,
      scaleType: 'PANS31',
      timestamp: Timestamp.now(),
      formData,
      scores,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'pans31Results'), resultDoc);

    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving PANS31 result:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates of PANS31 results
 */
export function subscribeToPANS31Results(
  callback: (results: PANS31ResultDocument[]) => void,
  limitCount: number = 100
): () => void {
  const q = query(
    collection(db, 'pans31Results'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const results: PANS31ResultDocument[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as PANS31ResultDocument);
      });
      callback(results);
    },
    (error) => {
      console.error('❌ Error in PANS31 subscription:', error);
    }
  );

  return unsubscribe;
}

/**
 * Get user's previous PANS31 results for comparison
 */
export async function getUserPANS31History(
  sessionId: string
): Promise<PANS31ResultDocument[]> {
  try {
    const q = query(
      collection(db, 'pans31Results'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const results: PANS31ResultDocument[] = [];
    snapshot.forEach((doc) => {
      results.push(doc.data() as PANS31ResultDocument);
    });

    return results;
  } catch (error) {
    console.error('❌ Error fetching PANS31 history:', error);
    return [];
  }
}

// ============================================================================
// Aggregation for Charts
// ============================================================================

export interface PANS31AggregatedData {
  count: number;
  averageTotal: number;
  averageCategories: PANS31Scores['categories'];
  severityDistribution: {
    minimal: number;
    mild: number;
    moderate: number;
    severe: number;
    extreme: number;
  };
  mostCommonHighSeverity: { symptom: string; count: number; percentage: number }[];
  completedByDistribution: {
    mother: number;
    father: number;
    other: number;
  };
}

export function aggregatePANS31Results(
  results: PANS31ResultDocument[]
): PANS31AggregatedData {
  if (results.length === 0) {
    return {
      count: 0,
      averageTotal: 0,
      averageCategories: {
        ocdEating: 0,
        anxietyMood: 0,
        behavioral: 0,
        cognitiveAcademic: 0,
        somatic: 0,
        psychosisTics: 0,
      },
      severityDistribution: { minimal: 0, mild: 0, moderate: 0, severe: 0, extreme: 0 },
      mostCommonHighSeverity: [],
      completedByDistribution: { mother: 0, father: 0, other: 0 },
    };
  }

  const count = results.length;

  // Sum totals
  let totalSum = 0;
  const categorySums = {
    ocdEating: 0,
    anxietyMood: 0,
    behavioral: 0,
    cognitiveAcademic: 0,
    somatic: 0,
    psychosisTics: 0,
  };

  const severityDistribution = { minimal: 0, mild: 0, moderate: 0, severe: 0, extreme: 0 };
  const completedByDistribution = { mother: 0, father: 0, other: 0 };

  // Track high severity symptoms
  const highSeverityCount: Record<string, number> = {};

  results.forEach((r) => {
    totalSum += r.scores.total;

    // Sum categories
    Object.keys(categorySums).forEach((cat) => {
      categorySums[cat as keyof typeof categorySums] +=
        r.scores.categories[cat as keyof typeof categorySums];
    });

    // Severity distribution
    severityDistribution[r.scores.severityLevel]++;

    // Completed by
    completedByDistribution[r.formData.additional.completedBy]++;

    // High severity symptoms (3 or 4)
    Object.entries(r.formData.symptoms).forEach(([symptom, rating]) => {
      if ((rating as number) >= 3) {
        highSeverityCount[symptom] = (highSeverityCount[symptom] || 0) + 1;
      }
    });
  });

  // Calculate averages
  const averageTotal = Math.round(totalSum / count);
  const averageCategories = {
    ocdEating: Math.round(categorySums.ocdEating / count),
    anxietyMood: Math.round(categorySums.anxietyMood / count),
    behavioral: Math.round(categorySums.behavioral / count),
    cognitiveAcademic: Math.round(categorySums.cognitiveAcademic / count),
    somatic: Math.round(categorySums.somatic / count),
    psychosisTics: Math.round(categorySums.psychosisTics / count),
  };

  // Get most common high severity symptoms
  const mostCommonHighSeverity = Object.entries(highSeverityCount)
    .map(([symptom, cnt]) => ({
      symptom,
      count: cnt,
      percentage: Math.round((cnt / count) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    count,
    averageTotal,
    averageCategories,
    severityDistribution,
    mostCommonHighSeverity,
    completedByDistribution,
  };
}
